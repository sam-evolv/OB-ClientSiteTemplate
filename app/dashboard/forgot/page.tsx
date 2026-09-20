import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { resolveForHost } from '@/lib/business/resolve';
import { ForgotForm } from './ForgotForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Reset your password',
  robots: { index: false, follow: false },
};

/** Request a password-reset email. Tenant-branded, like the sign-in page. */
export default async function ForgotPasswordPage() {
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
        <h1 className="ed-auth-title">Reset your password</h1>
        <p className="ed-auth-sub">
          Enter the email address for your account and we&rsquo;ll send you a link to set a
          new password.
        </p>
        <ForgotForm accent={accent} />
      </div>
    </main>
  );
}
