import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireEditableBusiness } from '@/lib/editor/session';
import { resolveBySlug } from '@/lib/business/resolve';
import { SiteEditor } from '@/components/editor/SiteEditor';
import type { EditorContent } from '@/components/editor/EditDrawer';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Edit your website',
  robots: { index: false, follow: false },
};

/**
 * The owner's site editor.
 *
 * The tenant is resolved from the session, never from the URL, so one owner can
 * never reach another business's editor. Content is loaded in the same shape the
 * public site renders, so what the owner edits is exactly what visitors get.
 */
export default async function DashboardPage() {
  const { business, sb } = await requireEditableBusiness();

  const b = await resolveBySlug(business.slug);
  if (!b) notFound();

  const [galleryRes, servicesRes] = await Promise.all([
    sb
      .from('business_media')
      .select('id, url, alt, caption, sort_order')
      .eq('business_id', business.id)
      .eq('kind', 'gallery')
      .order('sort_order', { ascending: true, nullsFirst: false }),
    sb
      .from('services')
      .select('id, name, description, price_cents, is_active, cta_url, cta_label')
      .eq('business_id', business.id)
      .order('sort_order', { ascending: true, nullsFirst: false }),
  ]);

  const content: EditorContent = {
    hero: {
      headline1: b.hero_headline_1 || null,
      headline2: b.hero_headline_2 || null,
      subhead: b.hero_subhead || null,
      imageUrl: b.hero_image?.url || null,
    },
    stats: b.stats.map((s) => ({ value: s.value ?? '', label: s.label ?? '' })),
    mission: {
      statement: b.mission_statement || null,
      highlight: b.mission_highlight_word || null,
    },
    about: {
      headline: b.about.headline || null,
      body: b.about.body || null,
      portraitUrl: b.about_portrait?.url || null,
    },
    included: b.amenities ?? [],
    faq: (b.faq ?? []).map((f) => ({ q: f.q, a: f.a })),
    contact: {
      phone: b.phone || null,
      email: b.email || null,
      address: b.location?.address ?? null,
    },
    gallery: (galleryRes.data ?? []).map((m) => ({
      id: m.id as string,
      url: m.url as string,
      alt: (m.alt as string | null) ?? null,
      caption: (m.caption as string | null) ?? null,
    })),
    services: (servicesRes.data ?? []).map((s) => ({
      id: s.id as string,
      name: s.name as string,
      description: (s.description as string | null) ?? null,
      price_cents: (s.price_cents as number | null) ?? null,
      is_active: Boolean(s.is_active),
      cta_url: (s.cta_url as string | null) ?? null,
      cta_label: (s.cta_label as string | null) ?? null,
    })),
  };

  const liveUrl = business.website_custom_domain
    ? `https://${business.website_custom_domain}`
    : `https://${business.slug}.donworthstudio.ie`;

  return (
    <SiteEditor
      b={b}
      content={content}
      liveUrl={liveUrl}
      published={Boolean(business.website_is_published)}
    />
  );
}
