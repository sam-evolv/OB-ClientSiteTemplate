'use client';

import { useActionState } from 'react';
import { changePasswordAction, type ChangePasswordState } from '@/lib/editor/auth-actions';

const INITIAL: ChangePasswordState = { error: null };

/**
 * Change-password form. Serves two cases with the same fields: the forced
 * first-time change after we issue a temporary password, and a voluntary later
 * change. On success the action redirects, so there is no success state here.
 */
export function PasswordForm({ forced }: { forced: boolean }) {
  const [state, action, pending] = useActionState(changePasswordAction, INITIAL);

  return (
    <form action={action} className="ed-login-form">
      <label className="ed-field">
        <span className="ed-label">{forced ? 'Temporary password' : 'Current password'}</span>
        <input
          className="ed-input"
          type="password"
          name="current"
          autoComplete="current-password"
          required
          autoFocus
        />
      </label>

      <label className="ed-field">
        <span className="ed-label">New password</span>
        <input
          className="ed-input"
          type="password"
          name="next"
          autoComplete="new-password"
          required
          minLength={10}
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
        At least 10 characters, with a letter and a number. A few words with a
        number in them is both easy to remember and hard to guess.
      </p>

      {state.error && (
        <p className="ed-error" role="alert">
          {state.error}
        </p>
      )}

      <button className="ed-button" type="submit" disabled={pending}>
        {pending ? 'Saving…' : forced ? 'Save and continue' : 'Change password'}
      </button>
    </form>
  );
}
