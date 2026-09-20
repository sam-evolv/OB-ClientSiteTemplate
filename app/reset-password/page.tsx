import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { resolveForHost } from '@/lib/business/resolve';
import { getEditorOwner } from '@/lib/editor/session';
import { RECOVERY_COOKIE } from '@/lib/editor/recovery';
import { ResetForm } from './ResetForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Set a new password',
  robots: { index: false, follow: false },
};

/**
 * Where a recovery link lands after the callback has exchanged its token.
 *
 * Requires both a session and the recovery marker: the session proves the token
 * was real, and the marker proves it came from a recovery link rather than an
 * ordinary sign-in. Without the marker check, anyone on a live session could set
 * a password without knowing the current one.
 */
export default async function ResetPasswordPage() {
  const jar = await cookies();
  const recovery = jar.get(RECOVERY_COOKIE)?.value === '1';
  const owner = await getEditorOwner();

  if (!recovery || !owner) redirect('/dashboard/login?error=link_invalid');

  const host = (await headers()).get('host');
  const b = await resolveForHost(host);
  const accent = b?.primary_colour ?? '#E23A2E';

  return (
    <main className="ed-auth">
      <div className="ed-auth-card">
        {b?.logo && (
          <img className="ed-auth-logo" src={b.logo} alt={b.name} width={72} height={72} />
        )}
        <p className="ed-eyebrow">Website admin</p>
        <h1 className="ed-auth-title">Choose a new password</h1>
        <p className="ed-auth-sub">
          You&rsquo;re signed in as {owner.email}. Pick a new password for your account.
        </p>
        <ResetForm />
        <p className="ed-hint">
          <Link href="/dashboard/login" style={{ color: accent }}>
            ← Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
