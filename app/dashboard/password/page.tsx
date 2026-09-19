import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { resolveForHost } from '@/lib/business/resolve';
import { getEditorOwner } from '@/lib/editor/session';
import { signOutAction } from '@/lib/editor/auth-actions';
import { PasswordForm } from './PasswordForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Change password',
  robots: { index: false, follow: false },
};

/**
 * Change password.
 *
 * Deliberately gated on a session only — not on requireEditableBusiness — or an
 * account carrying the temporary-password flag would be redirected here from
 * here, forever. The forced case also offers a sign-out, because an owner who
 * cannot set a password must still be able to get out of the page.
 */
export default async function ChangePasswordPage() {
  const owner = await getEditorOwner();
  if (!owner) redirect('/dashboard/login');

  const host = (await headers()).get('host');
  const b = await resolveForHost(host);
  const accent = b?.primary_colour ?? '#E23A2E';
  const forced = owner.mustChangePassword;

  return (
    <main className="ed-auth">
      <div className="ed-auth-card">
        {b?.logo && (
          <img className="ed-auth-logo" src={b.logo} alt={b.name} width={72} height={72} />
        )}
        <p className="ed-eyebrow">Website admin</p>
        <h1 className="ed-auth-title">
          {forced ? 'Choose your own password' : 'Change your password'}
        </h1>
        <p className="ed-auth-sub">
          {forced
            ? 'This account was set up with a temporary password. Pick your own to carry on.'
            : 'Pick a new password for your account.'}
        </p>

        <PasswordForm forced={forced} />

        <p className="ed-hint">
          {forced ? (
            <form action={signOutAction}>
              <button
                type="submit"
                style={{
                  background: 'none',
                  border: 0,
                  padding: 0,
                  cursor: 'pointer',
                  color: accent,
                  font: 'inherit',
                }}
              >
                Sign out instead
              </button>
            </form>
          ) : (
            <Link href="/dashboard" style={{ color: accent }}>
              ← Back to the editor
            </Link>
          )}
        </p>
      </div>
    </main>
  );
}
