'use client';

import { useActionState } from 'react';
import { signInAction, type SignInState } from '@/lib/editor/auth-actions';

const INITIAL: SignInState = { error: null };

/**
 * Owner sign-in. Deliberately minimal: two fields, one button. The page it
 * lives on carries the tenant's brand, so this stays neutral.
 */
export function LoginForm({ accent }: { accent: string }) {
  const [state, action, pending] = useActionState(signInAction, INITIAL);

  return (
    <form action={action} className="ed-login-form">
      <label className="ed-field">
        <span className="ed-label">Email</span>
        <input
          className="ed-input"
          type="email"
          name="email"
          autoComplete="email"
          required
          autoFocus
          placeholder="you@example.com"
        />
      </label>

      <label className="ed-field">
        <span className="ed-label">Password</span>
        <input
          className="ed-input"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          placeholder="Your password"
        />
      </label>

      {state.error && (
        <p className="ed-error" role="alert">
          {state.error}
        </p>
      )}

      <button className="ed-button" type="submit" disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="ed-hint">
        Forgot your password? Email{' '}
        <a href="mailto:sam@donworthstudio.ie" style={{ color: accent }}>
          sam@donworthstudio.ie
        </a>{' '}
        and we&rsquo;ll reset it for you.
      </p>
    </form>
  );
}
