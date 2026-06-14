import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { resolveByHost } from '@/lib/business/resolve';

/**
 * Host-aware sitemap. Each tenant domain serves a sitemap listing only its own
 * canonical URL (the single-page homepage). resolveByHost only matches a host
 * that is a published, live custom domain, so slug routes, *.vercel.app and
 * localhost get an empty sitemap — non-canonical URLs are never advertised for
 * indexing, and one tenant's sitemap never lists another tenant's pages.
 *
 * Section anchors are deliberately omitted: search engines collapse #fragment
 * URLs onto the base page, so listing them adds no indexable surface.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = (await headers()).get('host');
  const b = await resolveByHost(host);
  if (!b?.custom_domain) return [];

  return [
    {
      url: `https://${b.custom_domain}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0
    }
  ];
}
