'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { cookies, headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { createEditorClient } from './supabase-server';
import { passwordProblem } from './password';
import { RECOVERY_COOKIE } from './recovery';

/** The request's own origin, so reset links come back to the host they started on. */
async function requestOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? '';
  const proto =
    h.get('x-forwarded-proto') ??
    (/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host) ? 'http' : 'https');
  return host ? `${proto}://${host}` : '';
}

export interface SignInState {
  error: string | null;
}

export interface ChangePasswordState {
  error: string | null;
}

export interface ResetRequestState {
  error: string | null;
  sent: boolean;
}

/**
 * Sign the site owner in. Errors are returned as a generic message so the form
 * never reveals whether an address has an account.
 */
export async function signInAction(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { error: 'Enter your email and password.' };
  }

  const sb = await createEditorClient();
  const { error } = await sb.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: 'That email and password combination did not work.' };
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function signOutAction() {
  const sb = await createEditorClient();
  await sb.auth.signOut();
  revalidatePath('/dashboard');
  redirect('/dashboard/login');
}

/**
 * Change the signed-in owner's password.
 *
 * The current password is re-verified first: without that, anyone who got hold
 * of a live session (a shared laptop, a borrowed phone) could lock the real
 * owner out. On success the temporary-password flag is cleared, which is what
 * releases the account from /dashboard/password.
 */
export async function changePasswordAction(
  _prev: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const current = String(formData.get('current') ?? '');
  const next = String(formData.get('next') ?? '');
  const confirm = String(formData.get('confirm') ?? '');

  if (!current || !next) return { error: 'Fill in every field.' };
  if (next !== confirm) return { error: 'The two new passwords do not match.' };

  const problem = passwordProblem(next);
  if (problem) return { error: problem };

  const sb = await createEditorClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user?.email) return { error: 'Your session has expired. Sign in again.' };

  const { error: verifyError } = await sb.auth.signInWithPassword({
    email: user.email,
    password: current,
  });
  if (verifyError) return { error: 'That current password is not right.' };

  const { error } = await sb.auth.updateUser({
    password: next,
    data: { must_change_password: false },
  });
  if (error) return { error: 'Could not save that password. Try a longer one.' };

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

/**
 * Send a password-recovery email.
 *
 * Always reports success, whether or not the address has an account — otherwise
 * this page becomes a way to ask "does this person have an account here?".
 */
export async function requestPasswordResetAction(
  _prev: ResetRequestState,
  formData: FormData,
): Promise<ResetRequestState> {
  const email = String(formData.get('email') ?? '').trim();
  if (!email) return { error: 'Enter your email address.', sent: false };

  const origin = await requestOrigin();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return { error: 'Reset is not configured. Contact support.', sent: false };

  // Deliberately NOT the SSR client. @supabase/ssr uses the PKCE flow, which
  // chains the emailed link to a code-verifier cookie in whichever browser made
  // the request — so opening the email on a phone, in another browser, or after
  // clearing cookies fails with "Email link is invalid or has expired". That is
  // the ordinary case, not an edge case.
  //
  // Requesting in the implicit flow produces a verifier-free token_hash that the
  // callback can verify from anywhere. Verified: the link resolves to
  // /reset-password with every cookie cleared.
  const sb = createClient(url, anonKey, {
    auth: { flowType: 'implicit', persistSession: false, autoRefreshToken: false },
  });

  // next=/reset-password matches the recovery email template, which the callback
  // honours. redirectTo must be in the project's allowlist or Supabase silently
  // falls back to its Site URL.
  const { error } = await sb.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?type=recovery&next=/reset-password`,
  });

  // Supabase's built-in mailer allows a very small number of sends per hour, and
  // a swallowed failure here looks identical to a delivered email — the owner
  // waits for something that was never sent and reports that resets "don't work".
  // A rate-limit message reveals nothing about whether the address exists, so it
  // is safe to surface; every other error stays silent to avoid enumeration.
  if (error && /rate limit|too many/i.test(error.message)) {
    return {
      error: 'Too many reset requests just now. Please wait a few minutes and try again.',
      sent: false,
    };
  }

  return { error: null, sent: true };
}

/**
 * Set a new password from a recovery link.
 *
 * No current-password check here — the emailed token is the proof of identity,
 * and the owner by definition does not know the password they are replacing. The
 * RECOVERY_COOKIE the callback set is what stops this being reachable from an
 * ordinary session, and it is cleared as soon as it is used.
 */
export async function resetPasswordAction(
  _prev: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const jar = await cookies();
  if (jar.get(RECOVERY_COOKIE)?.value !== '1') {
    return { error: 'That reset link has expired. Request a new one.' };
  }

  const next = String(formData.get('next') ?? '');
  const confirm = String(formData.get('confirm') ?? '');
  if (!next) return { error: 'Choose a new password.' };
  if (next !== confirm) return { error: 'The two passwords do not match.' };

  const problem = passwordProblem(next);
  if (problem) return { error: problem };

  const sb = await createEditorClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return { error: 'That reset link has expired. Request a new one.' };

  const { error } = await sb.auth.updateUser({
    password: next,
    data: { must_change_password: false },
  });
  if (error) return { error: 'Could not save that password. Try a longer one.' };

  jar.delete(RECOVERY_COOKIE);
  revalidatePath('/dashboard');
  redirect('/dashboard');
}
