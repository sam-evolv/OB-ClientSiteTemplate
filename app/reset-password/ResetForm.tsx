'use client';

import { useActionState } from 'react';
import { resetPasswordAction, type ChangePasswordState } from '@/lib/editor/auth-actions';

const INITIAL: ChangePasswordState = { error: null };

/** Set a new password from a recovery link. No current-password field by design. */
export function ResetForm() {
  const [state, action, pending] = useActionState(resetPasswordAction, INITIAL);

  return (
    <form action={action} className="ed-login-form">
      <label className="ed-field">
        <span className="ed-label">New password</span>
        <input
          className="ed-input"
          type="password"
          name="next"
          autoComplete="new-password"
          required
          minLength={10}
          autoFocus
        />
      </label>

      <label className="ed-field">
        <span className="ed-label">New password again</span>
        <input
          className="ed-input"
          type="password"
          name="confirm"
          autoComplete="new-password"
          required
          minLength={10}
        />
      </label>

      <p className="ed-help">
        At least 10 characters, with a letter and a number. A few words with a number in
        them is both easy to remember and hard to guess.
      </p>

      {state.error && (
        <p className="ed-error" role="alert">
          {state.error}
        </p>
      )}

      <button className="ed-button" type="submit" disabled={pending}>
        {pending ? 'Saving…' : 'Set password and sign in'}
      </button>
    </form>
  );
}
