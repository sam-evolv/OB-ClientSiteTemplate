import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { resolveForHost } from '@/lib/business/resolve';
import { getEditorOwner } from '@/lib/editor/session';
import { LoginForm } from './LoginForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
};

/**
 * Owner sign-in for the site editor.
 *
 * The tenant is resolved from the request host, so the page wears the business's
 * own brand — logo, name and accent — rather than a platform brand. That is the
 * whole point: the owner should feel they are signing in to their own website.
 */
export default async function EditorLoginPage() {
  const owner = await getEditorOwner();
  if (owner) redirect('/dashboard');

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
        <h1 className="ed-auth-title">{b?.name ?? 'Sign in'}</h1>
        <p className="ed-auth-sub">Sign in to edit your website.</p>

        <LoginForm accent={accent} />

        <Link className="ed-auth-back" href="/">
          ← Back to the website
        </Link>
      </div>
    </main>
  );
}
