'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { requestPasswordResetAction, type ResetRequestState } from '@/lib/editor/auth-actions';

const INITIAL: ResetRequestState = { error: null, sent: false };

/**
 * Request a reset email. Reports the same success either way, so it cannot be
 * used to discover whether an address has an account here.
 */
export function ForgotForm({ accent }: { accent: string }) {
  const [state, action, pending] = useActionState(requestPasswordResetAction, INITIAL);

  if (state.sent) {
    return (
      <div>
        <p className="ed-ok" role="status">
          If that address has an account, a reset link is on its way. It is valid for a
          short time, so use it soon.
        </p>
        <p className="ed-hint">
          <Link href="/dashboard/login" style={{ color: accent }}>
            ← Back to sign in
          </Link>
        </p>
      </div>
    );
  }

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

      {state.error && (
        <p className="ed-error" role="alert">
          {state.error}
        </p>
      )}

      <button className="ed-button" type="submit" disabled={pending}>
        {pending ? 'Sending…' : 'Send reset link'}
      </button>

      <p className="ed-hint">
        <Link href="/dashboard/login" style={{ color: accent }}>
          ← Back to sign in
        </Link>
      </p>
    </form>
  );
}
