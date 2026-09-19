'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createEditorClient } from './supabase-server';

export interface SignInState {
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
