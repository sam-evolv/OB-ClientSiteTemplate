import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { MarketingPage } from '@/components/MarketingPage';
import { resolveForHost, buildJsonLd, buildMetadata } from '@/lib/business/resolve';

export const revalidate = 60;

/**
 * Root route. Resolves the business from the request host in precedence order
 * (resolveForHost): an exact custom-domain match (website_custom_domain, README
 * §9) FIRST — so simplygolf365.ie serves SIMply Golf at its own apex — THEN the
 * platform subdomain "<slug>.<PARENT>" (NEXT_PUBLIC_PLATFORM_DOMAIN), so
 * simplygolf365.openbook.ie serves the same tenant by slug.
 *
 * When no tenant maps to the host, the bare template/preview domain (localhost,
 * *.vercel.app) still falls back to the demo business so the Vercel preview
 * shows a site at its root URL. A real but unmapped customer domain — and the
 * bare parent / www.<PARENT> marketing root — return null instead, so RootPage
 * renders the clean 404 placeholder rather than leaking the demo tenant's
 * content onto an unconfigured domain.
 */
async function resolveRoot() {
  const host = (await headers()).get('host');
  return resolveForHost(host);
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
  const host = (await headers()).get('host');
  const b = await resolveRoot();
  if (!b) return {};
  // The root route is the canonical host-based route: indexable only when this
  // host is the tenant's own custom domain.
  return buildMetadata(b, { host, canonicalRoute: true });
}
