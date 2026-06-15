import { headers } from 'next/headers';
import {
  resolveCanonicalTenant,
  canonicalOriginForHost,
  platformDomain,
  isPlatformRootHost,
  listPublishedTenants,
  tenantSitemapIndexLocs
} from '@/lib/business/resolve';

/**
 * Host-aware /sitemap.xml. Replaces the metadata `sitemap.ts` because that can
 * only emit a <urlset>, and the platform root needs a <sitemapindex>:
 *
 *  - Platform root (sites.openbook.ie / www.sites.openbook.ie) → a MASTER
 *    SITEMAP INDEX listing every published+live tenant's own sitemap (its custom
 *    domain when set, else "<slug>.<PARENT>"), so Google/Bing discover all
 *    tenants from one URL.
 *  - A specific tenant host (custom domain or platform subdomain) → that
 *    tenant's own single-URL <urlset> — unchanged from the previous per-tenant
 *    sitemap.
 *  - Marketing/preview/localhost/unmapped hosts → an empty <urlset>.
 *
 * Reads the request Host, so it is always dynamic (per host).
 */
export const dynamic = 'force-dynamic';

const XMLNS = 'http://www.sitemaps.org/schemas/sitemap/0.9';

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function xml(body: string): Response {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n${body}\n`, {
    headers: { 'Content-Type': 'application/xml' }
  });
}

export async function GET() {
  const host = (await headers()).get('host');
  const parent = platformDomain();
  const lastmod = new Date().toISOString();

  // 1. Platform root → master sitemap INDEX over every tenant's own sitemap.
  if (isPlatformRootHost(host, parent)) {
    const tenants = await listPublishedTenants();
    const entries = tenantSitemapIndexLocs(tenants, parent)
      .map((loc) => `  <sitemap><loc>${xmlEscape(loc)}</loc><lastmod>${lastmod}</lastmod></sitemap>`)
      .join('\n');
    return xml(`<sitemapindex xmlns="${XMLNS}">\n${entries}\n</sitemapindex>`);
  }

  // 2. A tenant host → its own single canonical URL (unchanged per-tenant sitemap).
  const tenant = await resolveCanonicalTenant(host);
  const origin = tenant ? canonicalOriginForHost(tenant, host) : null;
  if (origin) {
    const url =
      `  <url><loc>${xmlEscape(origin)}/</loc>` +
      `<lastmod>${lastmod}</lastmod>` +
      `<changefreq>weekly</changefreq>` +
      `<priority>1.0</priority></url>`;
    return xml(`<urlset xmlns="${XMLNS}">\n${url}\n</urlset>`);
  }

  // 3. Marketing/preview/localhost/unmapped → empty <urlset>.
  return xml(`<urlset xmlns="${XMLNS}">\n</urlset>`);
}
