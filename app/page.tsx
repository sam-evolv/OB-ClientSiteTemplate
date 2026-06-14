import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { MarketingPage } from '@/components/MarketingPage';
import {
  resolveByHost,
  resolveBySlug,
  isDemoFallbackHost,
  DEMO_SLUG,
  buildJsonLd,
  buildMetadata
} from '@/lib/business/resolve';

export const revalidate = 60;

/**
 * Root route. Resolves the business from the request host via the
 * website_custom_domain column (README §9) — so simplygolf365.ie serves the
 * SIMply Golf business at its own apex.
 *
 * When no tenant maps to the host, the bare template/preview domain (localhost,
 * *.vercel.app) still falls back to the demo business so the Vercel preview
 * shows a site at its root URL. A real but unmapped customer domain returns
 * null instead, so RootPage renders the clean 404 placeholder rather than
 * leaking the demo tenant's content onto an unconfigured domain.
 */
async function resolveRoot() {
  const host = (await headers()).get('host');
  const byHost = await resolveByHost(host);
  if (byHost) return byHost;
  return isDemoFallbackHost(host) ? resolveBySlug(DEMO_SLUG) : null;
}

export default async function RootPage() {
  const b = await resolveRoot();
  if (!b) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(b)) }}
      />
      <MarketingPage b={b} />
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const b = await resolveRoot();
  if (!b) return {};
  return buildMetadata(b);
}
