import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MarketingPage } from '@/components/MarketingPage';
import { resolveBySlug, buildJsonLd, buildMetadata } from '@/lib/business/resolve';

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

/**
 * Single business marketing page, addressed by slug (e.g. /simplygolf365).
 * Renders a fixed-order MarketingPage from the view-model; the section
 * components decide whether to render based on data.
 */
export default async function BusinessPage({ params }: PageProps) {
  const { slug } = await params;
  const b = await resolveBySlug(slug);
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const b = await resolveBySlug(slug);
  if (!b) return {};
  return buildMetadata(b);
}
