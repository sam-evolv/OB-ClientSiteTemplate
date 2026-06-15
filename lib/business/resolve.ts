import type { Metadata } from 'next';
import { loadBusinessForMarketing } from '@/lib/queries/loadBusinessForMarketing';
import { toBusinessViewModel, type BusinessVM } from '@/lib/viewModel/businessViewModel';
import { mapNamedColourToHex } from '@/lib/utils/colour';
import { simplyGolf } from '@/lib/data/simplyGolf';
import { createAnonClient } from '@/lib/supabase';

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
 * (README §9). e.g. simplygolf365.ie → the simplygolf365 business. Returns null
 * for hosts with no mapping (the bare template/preview domain), so the caller
 * can fall back to the demo business.
 */
export async function resolveByHost(host: string | null): Promise<BusinessVM | null> {
  if (!host || !supabaseConfigured()) return null;
  const domain = host.split(':')[0].trim().toLowerCase().replace(/^www\./, '');
  if (!domain) return null;
  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from('businesses')
      .select('slug')
      .eq('website_custom_domain', domain)
      .eq('website_is_published', true)
      .eq('is_live', true)
      .maybeSingle();
    if (error || !data?.slug) return null;
    return resolveBySlug(data.slug);
  } catch {
    return null;
  }
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

/** Normalize a Host header for comparison: drop port, lowercase, strip leading www. */
export function normalizeHost(host: string | null | undefined): string {
  if (!host) return '';
  return host.split(':')[0].trim().toLowerCase().replace(/^www\./, '');
}

/** The tenant's canonical origin (https://<custom_domain>), or null when no domain is set. */
function canonicalOrigin(b: BusinessVM): string | null {
  return b.custom_domain ? `https://${b.custom_domain}` : null;
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
 * Exactly one URL per tenant is indexable: the canonical custom-domain root,
 * served by the host-based root route. Every other host — the slug route, the
 * demo fallback on localhost/*.vercel.app, or a tenant with no custom domain
 * yet (e.g. evolv-performance today) — is noindex and canonicalised to the
 * custom domain when one exists, so previews and not-yet-live tenants stay out
 * of the index and slug/preview URLs never compete with the canonical site.
 */
export function buildMetadata(
  b: BusinessVM,
  opts: { host?: string | null; canonicalRoute?: boolean } = {}
): Metadata {
  const origin = canonicalOrigin(b);
  const canonical = origin ? `${origin}/` : undefined;
  const indexable = Boolean(
    opts.canonicalRoute && b.custom_domain && normalizeHost(opts.host) === b.custom_domain
  );

  const title = b.tagline ? `${b.name} — ${b.tagline}` : b.name;
  const description = b.hero_subhead || b.tagline || undefined;
  const ogImage = absoluteMediaUrl(b.hero_image?.url, origin);

  return {
    title,
    description,
    ...(canonical ? { alternates: { canonical } } : {}),
    robots: {
      index: indexable,
      follow: true,
      googleBot: { index: indexable, follow: true }
    },
    openGraph: {
      title,
      description,
      type: 'website',
      ...(canonical ? { url: canonical } : {}),
      images: ogImage ? [{ url: ogImage }] : []
    }
  };
}
