import type { Metadata } from 'next';
import { loadBusinessForMarketing } from '@/lib/queries/loadBusinessForMarketing';
import { toBusinessViewModel, type BusinessVM } from '@/lib/viewModel/businessViewModel';
import { mapNamedColourToHex } from '@/lib/utils/colour';
import { simplyGolf } from '@/lib/data/simplyGolf';
import { createAnonClient } from '@/lib/supabase';
import {
  normalizeHost,
  hostMatchesDomain,
  googleSiteVerification,
  subdomainLabel,
  resolveTenantByHost
} from './host';

// Re-exported so existing importers (and tests) can reach the pure host helpers.
export {
  normalizeHost,
  hostMatchesDomain,
  googleSiteVerification,
  subdomainLabel,
  resolveTenantByHost
};

/**
 * Business resolution for the marketing site. Shared by the slug route and the
 * root route.
 *
 * Production: read the published row from Supabase and map it to the view-model.
 * Local dev / CI / preview without Supabase env: serve the bundled canonical
 * content for the demo business. Because the seed writes exactly that content,
 * the render is identical either way.
 */

export const DEMO_SLUG = simplyGolf.slug;

export function supabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/**
 * The platform parent domain for subdomain-based tenant routing (e.g.
 * "openbook.ie"), read from NEXT_PUBLIC_PLATFORM_DOMAIN and normalised (port
 * dropped, lowercased, a leading "www." tolerated). Empty when unset — and while
 * it is empty, subdomain routing is inert and host resolution behaves exactly as
 * it did before this feature.
 */
export function platformDomain(): string {
  return (process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? '')
    .split(':')[0]
    .trim()
    .toLowerCase()
    .replace(/^www\./, '');
}

/** Resolve a business by its slug. */
export async function resolveBySlug(slug: string): Promise<BusinessVM | null> {
  if (supabaseConfigured()) {
    const data = await loadBusinessForMarketing(slug);
    if (!data) return null;
    return toBusinessViewModel(data, mapNamedColourToHex(data.business.primary_colour));
  }
  if (slug === simplyGolf.slug) return simplyGolf;
  return null;
}

/**
 * Resolve a business by request host via the website_custom_domain column
 * (README §9). e.g. simplygolf365.ie → the simplygolf365 business.
 *
 * Matching is www-, case- and port-insensitive on BOTH sides: the apex and the
 * "www." variant of a domain resolve to the same tenant regardless of which
 * variant the row stores (the apex 307-redirects to www. in production, so the
 * served host and the stored value can legitimately differ). Returns null for
 * hosts with no mapping, so the caller can fall back to the demo business or
 * 404.
 */
export async function resolveByHost(host: string | null): Promise<BusinessVM | null> {
  if (!supabaseConfigured()) return null;
  const target = normalizeHost(host);
  if (!target) return null;
  try {
    const supabase = createAnonClient();
    // Fetch the (small) set of published, live tenants that have a custom
    // domain, then match in JS with the shared normaliser. This resolves apex,
    // www. and case variants whichever way the row is stored, and never
    // interpolates the untrusted Host header into the query (no filter
    // injection). The set is bounded by the number of domained tenants; a
    // generated normalised column + indexed lookup is the path at larger scale.
    const { data, error } = await supabase
      .from('businesses')
      .select('slug, website_custom_domain')
      .not('website_custom_domain', 'is', null)
      .eq('website_is_published', true)
      .eq('is_live', true);
    if (error || !data) return null;
    const match = data.find((row) => hostMatchesDomain(target, row.website_custom_domain));
    if (!match?.slug) return null;
    return resolveBySlug(match.slug);
  } catch {
    return null;
  }
}

/**
 * Resolve the tenant whose OWN canonical host is `host`, in precedence order:
 *   1. an exact custom-domain match (resolveByHost, README §9) — unchanged, and
 *   2. the platform subdomain "<slug>.<PARENT>", where PARENT comes from
 *      NEXT_PUBLIC_PLATFORM_DOMAIN, looked up by slug.
 *
 * The custom-domain match is tried first and wins, so the live custom-domain
 * sites (e.g. www.simplygolf365.ie) resolve exactly as before. Returns null when
 * no real tenant claims the host — there is NO demo fallback here, so callers
 * that must never advertise the demo tenant onto a preview/marketing host (the
 * sitemap) get an empty result. The bare parent and "www.<PARENT>" resolve to
 * null (subdomainLabel rejects them): they are the marketing root, not tenants.
 */
export function resolveCanonicalTenant(host: string | null): Promise<BusinessVM | null> {
  return resolveTenantByHost(host, platformDomain(), {
    byCustomDomain: resolveByHost,
    bySlug: resolveBySlug
  });
}

/**
 * Hosts that may fall back to the demo business when no tenant maps to them.
 * These are non-customer hosts only: local dev and Vercel preview/deployment
 * URLs (`*.vercel.app`), plus anything listed in NEXT_PUBLIC_DEMO_FALLBACK_HOSTS.
 *
 * A real customer domain that is not yet mapped is deliberately NOT in this set,
 * so the root route renders a clean 404 placeholder for it rather than leaking
 * the demo tenant's content onto an unconfigured domain. A null/empty host
 * (build-time render, internal prefetch) is treated as a fallback host because
 * it is never a real customer request.
 */
export function isDemoFallbackHost(host: string | null): boolean {
  if (!host) return true;
  const h = host.split(':')[0].trim().toLowerCase();
  if (!h) return true;
  if (h === 'localhost' || h === '127.0.0.1' || h === '0.0.0.0' || h === '::1') return true;
  if (h.endsWith('.vercel.app')) return true;
  const extra = (process.env.NEXT_PUBLIC_DEMO_FALLBACK_HOSTS ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return extra.includes(h);
}

/**
 * Full root-route resolution for a request host, in precedence order:
 *   1. the tenant whose canonical host this is — custom domain, then platform
 *      subdomain (resolveCanonicalTenant), then
 *   2. the demo business on preview/build hosts (localhost, *.vercel.app, …),
 *      else
 *   3. null — a clean 404 for an unmapped customer host.
 *
 * Centralises the precedence shared by the root page and its metadata so the
 * page and generateMetadata always resolve identically.
 */
export async function resolveForHost(host: string | null): Promise<BusinessVM | null> {
  const tenant = await resolveCanonicalTenant(host);
  if (tenant) return tenant;
  return isDemoFallbackHost(host) ? resolveBySlug(DEMO_SLUG) : null;
}

/** The tenant's canonical origin (https://<custom_domain>), or null when no domain is set. */
function canonicalOrigin(b: BusinessVM): string | null {
  return b.custom_domain ? `https://${b.custom_domain}` : null;
}

/**
 * A tenant's canonical absolute origin for a given request host:
 *   - its custom domain when set (always wins — a tenant with both a custom
 *     domain and a platform subdomain keeps the same canonical it has today), else
 *   - its platform subdomain "https://<slug>.<PARENT>" when THIS request is being
 *     served on that subdomain, else
 *   - null.
 *
 * Shared by buildMetadata and the sitemap so the canonical link, the sitemap URL
 * and indexability all agree on what a tenant's canonical URL is for the host.
 */
export function canonicalOriginForHost(b: BusinessVM, host: string | null | undefined): string | null {
  if (b.custom_domain) return `https://${b.custom_domain}`;
  const parent = platformDomain();
  if (parent && b.slug && subdomainLabel(host, parent) === b.slug) {
    return `https://${b.slug}.${parent}`;
  }
  return null;
}

/** Resolve a possibly-relative media path to an absolute URL on the canonical origin. */
function absoluteMediaUrl(url: string | undefined, origin: string | null): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  if (!origin) return undefined;
  return `${origin}${url.startsWith('/') ? '' : '/'}${url}`;
}

/**
 * The most specific schema.org LocalBusiness subtype we are confident about for
 * a category, defaulting to LocalBusiness. The subtype is additive: the entity
 * is still a LocalBusiness, so consumers that only match LocalBusiness work.
 */
function schemaBusinessType(category: string): string {
  const c = (category || '').toLowerCase();
  if (/(golf|gym|fitness|training|sport|yoga|pilates|crossfit|climb)/.test(c)) {
    return 'SportsActivityLocation';
  }
  if (/(barber|hair)/.test(c)) return 'HairSalon';
  if (/(nail|beauty|spa|salon|aesthetic|lash|brow)/.test(c)) return 'HealthAndBeautyBusiness';
  if (/(physio|clinic|therap|medical|health|dental|chiro)/.test(c)) return 'MedicalBusiness';
  return 'LocalBusiness';
}

/**
 * LocalBusiness + Service JSON-LD for a resolved business, built from the SAME
 * view-model the page renders, so name/address/phone, hours and services are
 * consistent by construction. Geo (lat/lng) is intentionally omitted — there
 * are no coordinates in the schema. `url`/`@id` use the tenant's canonical
 * custom domain when one is set.
 */
export function buildJsonLd(b: BusinessVM) {
  const origin = canonicalOrigin(b);
  const subtype = schemaBusinessType(b.category);
  const image = absoluteMediaUrl(b.hero_image?.url, origin);
  const logo = absoluteMediaUrl(b.logo, origin);

  const address = b.location
    ? {
        '@type': 'PostalAddress',
        streetAddress:
          [b.location.address, b.location.address_line].filter(Boolean).join(', ') || undefined,
        addressLocality: b.location.city || undefined,
        addressCountry: 'IE'
      }
    : undefined;

  const openingHoursSpecification = b.hours
    .filter((d) => d.open && d.opens && d.closes)
    .map((d) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: d.label,
      opens: d.opens,
      closes: d.closes
    }));

  const offers = b.service_groups.flatMap((g) =>
    g.services.map((s) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: s.name,
        ...(s.description ? { description: s.description } : {}),
        ...(g.title ? { category: g.title } : {})
      },
      ...(s.price !== null && s.price !== undefined
        ? { price: String(s.price), priceCurrency: 'EUR' }
        : { description: 'On enquiry' })
    }))
  );

  return {
    '@context': 'https://schema.org',
    '@type': subtype === 'LocalBusiness' ? 'LocalBusiness' : ['LocalBusiness', subtype],
    name: b.name,
    ...(origin ? { '@id': `${origin}/#business`, url: `${origin}/` } : {}),
    description: b.hero_subhead || b.tagline || undefined,
    telephone: b.phone || undefined,
    email: b.email || undefined,
    ...(image ? { image } : {}),
    ...(logo ? { logo } : {}),
    ...(address ? { address } : {}),
    ...(b.travel ? { areaServed: 'Munster, Ireland' } : {}),
    ...(openingHoursSpecification.length ? { openingHoursSpecification } : {}),
    ...(offers.length
      ? { hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Services', itemListElement: offers } }
      : {}),
    foundingDate: b.founded ? String(b.founded) : undefined,
    sameAs: [b.instagram_url].filter(Boolean)
  };
}

/**
 * Host-aware SEO metadata for a resolved business.
 *
 * A tenant is indexable only on its OWN canonical host, served by the host-based
 * root route: its custom domain, OR — when no custom domain is mapped yet — its
 * platform subdomain "<slug>.<PARENT>" (NEXT_PUBLIC_PLATFORM_DOMAIN). The
 * canonical link points at that same host (custom domain when set, else the
 * subdomain). Every other host — the slug route, the demo fallback on
 * localhost/*.vercel.app, or any non-canonical host — is noindex and
 * canonicalised to the tenant's canonical origin, so previews and slug/preview
 * URLs never compete with the canonical site. While NEXT_PUBLIC_PLATFORM_DOMAIN
 * is unset the subdomain branch is inert and this behaves exactly as before.
 */
export function buildMetadata(
  b: BusinessVM,
  opts: { host?: string | null; canonicalRoute?: boolean } = {}
): Metadata {
  const parent = platformDomain();
  const onCustomDomain = Boolean(b.custom_domain && hostMatchesDomain(opts.host, b.custom_domain));
  const onSubdomain = Boolean(parent && b.slug && subdomainLabel(opts.host, parent) === b.slug);

  const origin = canonicalOriginForHost(b, opts.host);
  const canonical = origin ? `${origin}/` : undefined;
  // Indexable only on the tenant's own canonical host (custom domain or platform
  // subdomain), and only via the canonical root route — the slug route and the
  // demo/preview fallback stay noindex.
  const indexable = Boolean(opts.canonicalRoute && (onCustomDomain || onSubdomain));

  const title = b.tagline ? `${b.name} — ${b.tagline}` : b.name;
  const description = b.hero_subhead || b.tagline || undefined;
  const ogImage = absoluteMediaUrl(b.hero_image?.url, origin);

  // Per-tenant Google Search Console verification: only the matched tenant's own
  // custom-domain site emits its token (never the demo fallback or unmapped
  // hosts). Emits nothing when the column is null/empty.
  const googleVerification = googleSiteVerification(b.gsc_verification, opts.host, b.custom_domain);

  return {
    title,
    description,
    ...(canonical ? { alternates: { canonical } } : {}),
    robots: {
      index: indexable,
      follow: true,
      googleBot: { index: indexable, follow: true }
    },
    ...(googleVerification ? { verification: { google: googleVerification } } : {}),
    openGraph: {
      title,
      description,
      type: 'website',
      ...(canonical ? { url: canonical } : {}),
      images: ogImage ? [{ url: ogImage }] : []
    }
  };
}
