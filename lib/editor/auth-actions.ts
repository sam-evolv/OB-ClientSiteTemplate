'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createEditorClient } from './supabase-server';
import { passwordProblem } from './password';

export interface SignInState {
  error: string | null;
}

export interface ChangePasswordState {
  error: string | null;
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
