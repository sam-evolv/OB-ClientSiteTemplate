import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { resolveCanonicalTenant, canonicalOriginForHost } from '@/lib/business/resolve';

/**
 * Host-aware sitemap. Each tenant's canonical host serves a sitemap listing only
 * that tenant's own canonical URL (the single-page homepage): its custom domain,
 * or — when none is mapped — its platform subdomain "<slug>.<PARENT>".
 * resolveCanonicalTenant only matches a published, live custom domain or platform
 * subdomain (no demo fallback), so slug routes, *.vercel.app, localhost and the
 * marketing root get an empty sitemap — non-canonical URLs are never advertised
 * for indexing, and one tenant's sitemap never lists another tenant's pages.
 *
 * Section anchors are deliberately omitted: search engines collapse #fragment
 * URLs onto the base page, so listing them adds no indexable surface.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = (await headers()).get('host');
  const b = await resolveCanonicalTenant(host);
  const origin = b ? canonicalOriginForHost(b, host) : null;
  if (!origin) return [];

  return [
    {
      url: `${origin}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0
    }
  ];
}
