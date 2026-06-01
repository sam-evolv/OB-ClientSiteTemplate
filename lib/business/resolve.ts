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

/** LocalBusiness JSON-LD for a resolved business. */
export function buildJsonLd(b: BusinessVM) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: b.name,
    description: b.hero_subhead || b.tagline || undefined,
    telephone: b.phone || undefined,
    email: b.email || undefined,
    areaServed: b.travel ? 'Munster, Ireland' : undefined,
    foundingDate: b.founded ? String(b.founded) : undefined,
    sameAs: [b.instagram_url].filter(Boolean)
  };
}

/** SEO metadata for a resolved business. */
export function buildMetadata(b: BusinessVM): Metadata {
  const title = b.tagline ? `${b.name} — ${b.tagline}` : b.name;
  const description = b.hero_subhead || b.tagline || undefined;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: b.hero_image.url ? [{ url: b.hero_image.url }] : []
    }
  };
}
