import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { MarketingPage } from '@/components/MarketingPage';
import {
  resolveByHost,
  resolveBySlug,
  DEMO_SLUG,
  buildJsonLd,
  buildMetadata
} from '@/lib/business/resolve';

export const revalidate = 60;

/**
 * Root route. Resolves the business from the request host via the
 * website_custom_domain column (README §9) — so simplygolf365.ie serves the
 * SIMply Golf business at its own apex. The bare template/preview domain has no
 * domain mapping, so it falls back to the demo business, which is what makes the
 * Vercel preview show the site at its root URL.
 */
async function resolveRoot() {
  const host = (await headers()).get('host');
  return (await resolveByHost(host)) ?? (await resolveBySlug(DEMO_SLUG));
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
