import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadBusinessForMarketing } from '@/lib/queries/loadBusinessForMarketing';
import { MarketingPage } from '@/components/MarketingPage';

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

/**
 * Single business marketing page. Reads directly from the businesses
 * table (plus services, business_hours, business_media) by slug, and
 * renders a fixed-order MarketingPage. The page knows nothing about
 * section types; the section components decide whether to render
 * based on data.
 */
export default async function BusinessPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await loadBusinessForMarketing(slug);
  if (!data) notFound();
  return <MarketingPage data={data} />;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadBusinessForMarketing(slug);
  if (!data) return {};
  const b = data.business;
  return {
    title: b.tagline ? `${b.name} | ${b.tagline}` : b.name,
    description: b.website_hero_subhead ?? b.description ?? b.tagline ?? undefined,
    openGraph: {
      title: b.name,
      description: b.website_hero_subhead ?? b.tagline ?? undefined,
      images: b.website_hero_image_url ? [{ url: b.website_hero_image_url }] : []
    }
  };
}
