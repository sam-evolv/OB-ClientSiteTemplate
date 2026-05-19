import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { simplyGolf365 } from '@/lib/mock/simply-golf';
import { renderSection } from '@/components/sections/render';

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

/**
 * Single business page. Currently backed by the SIMply Golf 365 mock; the
 * Supabase loader replaces this in a later commit. Section components are
 * placeholders that render the schema-validated content with TODO markers.
 */
export default async function BusinessPage({ params }: PageProps) {
  const { slug } = await params;
  if (slug !== simplyGolf365.slug) notFound();

  const business = simplyGolf365;
  const sections = [...business.sections].sort((a, b) => a.display_order - b.display_order);

  return (
    <main
      className="bg-[var(--bg)] text-white min-h-screen font-serif"
      style={{ ['--accent' as string]: business.primary_colour } as React.CSSProperties}
    >
      {sections.map((section) => renderSection(section, business))}
    </main>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== simplyGolf365.slug) return {};
  return {
    title: simplyGolf365.name,
    description: simplyGolf365.tagline ?? undefined
  };
}
