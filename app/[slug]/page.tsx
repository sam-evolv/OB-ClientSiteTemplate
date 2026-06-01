import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadBusinessForMarketing } from '@/lib/queries/loadBusinessForMarketing';
import { MarketingPage } from '@/components/MarketingPage';
import { toBusinessViewModel, type BusinessVM } from '@/lib/viewModel/businessViewModel';
import { mapNamedColourToHex } from '@/lib/utils/colour';
import { simplyGolf } from '@/lib/data/simplyGolf';

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

function supabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/**
 * Resolves a slug to the business view-model the components consume.
 *
 * Production: read the published row from Supabase and map it onto the
 * view-model. Local dev / CI / the visual-diff check (no Supabase env): serve
 * the bundled canonical content for the demo business. Because the seed writes
 * exactly that content, the render is identical either way — which is what makes
 * the local pixel-diff against reference/04-visual-artifact.html meaningful.
 */
async function resolveBusiness(slug: string): Promise<BusinessVM | null> {
  if (supabaseConfigured()) {
    const data = await loadBusinessForMarketing(slug);
    if (!data) return null;
    return toBusinessViewModel(data, mapNamedColourToHex(data.business.primary_colour));
  }
  if (slug === simplyGolf.slug) return simplyGolf;
  return null;
}

/**
 * Single business marketing page. Renders a fixed-order MarketingPage from the
 * view-model; the section components decide whether to render based on data.
 */
export default async function BusinessPage({ params }: PageProps) {
  const { slug } = await params;
  const b = await resolveBusiness(slug);
  if (!b) notFound();

  const jsonLd = {
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MarketingPage b={b} />
    </>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const b = await resolveBusiness(slug);
  if (!b) return {};
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
