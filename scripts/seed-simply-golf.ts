/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Seed: SIMply Golf 365 (README §5 column map).
 *
 * Maps the canonical content (lib/data/simplyGolf.ts — a 1:1 mirror of the
 * handoff's data.jsx) onto the Supabase `businesses` row plus `services`,
 * `business_media` and `business_hours`. Importing the canonical module means
 * the seed can never drift from what the site renders.
 *
 * Idempotent by slug for businesses and by (business_id, day_of_week) for hours.
 * Services and media are wiped and re-inserted on each run so the seed data is
 * the source of truth. Requires the columns added by migration
 * 20260601120000_simplygolf365_handoff_columns.sql.
 *
 * Run locally (uses the service role key — never ship this to a client runtime):
 *   set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SEED_OWNER_ID in
 *   .env.local, then:
 *   node --env-file=.env.local --experimental-strip-types scripts/seed-simply-golf.ts
 *
 * Optional: SEED_MEDIA_BASE — base URL for media (e.g. the Supabase Storage
 * public URL). When unset, the bundled /media/* paths are used (these resolve
 * against /public for local dev and preview).
 */

import { createClient } from '@supabase/supabase-js';
// Type-only import is erased by --experimental-strip-types, so the '@/' alias in
// simplyGolf.ts never has to resolve at runtime; the value import below is a
// plain relative path that Node loads directly.
import { simplyGolf } from '../lib/data/simplyGolf.ts';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OWNER_ID = process.env.SEED_OWNER_ID;
const MEDIA_BASE = process.env.SEED_MEDIA_BASE?.replace(/\/$/, '') ?? '';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !OWNER_ID) {
  console.error('Missing env: set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SEED_OWNER_ID');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const b = simplyGolf;
const url = (p: string) => (MEDIA_BASE ? `${MEDIA_BASE}${p}` : p);

/** Best-effort duration_minutes for the booking table; the marketing card shows duration_label. */
function durationToMinutes(label: string): number {
  const mult = label.match(/(\d+)\s*[×x]\s*(\d+)/);
  if (mult) return Number(mult[1]) * Number(mult[2]);
  const hr = label.match(/(\d+)\s*hour/i);
  if (hr) return Number(hr[1]) * 60;
  const min = label.match(/(\d+)\s*min/i);
  if (min) return Number(min[1]);
  return 60;
}

const businessFields = {
  owner_id: OWNER_ID,
  slug: b.slug,
  name: b.name,
  category: b.category,
  city: 'Cork',
  year_founded: b.founded,
  // 'pearl' is the palette name for #F5F5F4. businesses.primary_colour is a
  // named-colour allowlist; the marketing loader maps the name back to the hex.
  primary_colour: 'pearl',
  tagline: b.tagline,
  email: b.email,
  phone: b.phone,
  instagram_handle: b.instagram,
  instagram_url: b.instagram_url,
  website: 'https://simplygolf365.ie',
  website_custom_domain: 'simplygolf365.ie',
  website_hero_headline_1: b.hero_headline_1,
  website_hero_headline_2: b.hero_headline_2,
  website_hero_subhead: b.hero_subhead,
  website_hero_variant: b.hero_variant,
  website_hero_image_url: url(b.hero_image.url),
  website_about_headline: b.about.headline,
  website_about_body: b.about.body,
  about_long: b.about.body,
  logo_url: url(b.logo),
  founder_name: b.founder.name,
  founder_role: b.founder.role,
  founder_bio: b.founder.bio,
  founder_photo_url: url(b.about_portrait.url),
  mission_statement: b.mission_statement,
  mission_highlight_word: b.mission_highlight_word,
  travel_zones: b.travel,
  venue_requirements: b.venue_requirements,
  trust_signals: b.trust_signals,
  website_stats: b.stats,
  press_mentions: b.press_mentions,
  testimonials: b.testimonials,
  // Per-tenant legal pages surfaced in the marketing footer (GDPR + EU Consumer
  // Rights Directive). Static pages served from /public/simplygolf365/.
  privacy_url: b.privacy_url,
  terms_url: b.terms_url,
  is_live: true,
  website_is_published: true
};

let order = 1;
const services = b.service_groups.flatMap((g) =>
  g.services.map((s) => ({
    group_name: g.title,
    group_blurb: g.blurb,
    name: s.name,
    description: s.description,
    duration_label: s.duration,
    duration_minutes: durationToMinutes(s.duration),
    // price_cents is NOT NULL on the booking table; 0 = "On enquiry" (§5 null price).
    price_cents: s.price === null ? 0 : Math.round(s.price * 100),
    is_popular: s.popular,
    sort_order: order++,
    is_active: true
  }))
);

const media: any[] = [
  { kind: 'logo', media_type: 'image', url: url(b.logo), alt: b.name, sort_order: 0 },
  {
    kind: 'hero',
    media_type: 'image',
    url: url(b.hero_image.url),
    video_url: b.hero_image.videoUrl ? url(b.hero_image.videoUrl) : null,
    alt: b.hero_image.alt ?? null,
    sort_order: 0
  },
  {
    kind: 'about',
    media_type: 'image',
    url: url(b.about_portrait.url),
    alt: b.about_portrait.alt ?? null,
    caption: b.about_portrait.caption ?? null,
    sort_order: 0
  },
  ...b.gallery.map((g, i) =>
    g.type === 'video'
      ? {
          kind: 'gallery',
          media_type: 'video',
          url: url(g.posterUrl),
          video_url: g.videoUrl ? url(g.videoUrl) : null,
          alt: g.alt ?? null,
          label: g.label ?? null,
          caption: g.caption ?? null,
          sort_order: i
        }
      : {
          kind: 'gallery',
          media_type: 'image',
          url: url(g.url),
          alt: g.alt ?? null,
          caption: g.caption ?? null,
          sort_order: i
        }
  )
];

// Mobile business: by-appointment. No fixed hours; all days closed.
const hours = Array.from({ length: 7 }, (_, day) => ({
  day_of_week: day,
  is_open: false,
  is_closed: true,
  open_time: null,
  close_time: null
}));

async function main() {
  console.log('[seed] upserting business by slug');
  const { data: upserted, error: upsertError } = await supabase
    .from('businesses')
    .upsert(businessFields, { onConflict: 'slug' })
    .select('id')
    .single();

  if (upsertError || !upserted) {
    console.error('[seed] business upsert failed', upsertError);
    process.exit(1);
  }

  const businessId = upserted.id;
  console.log(`[seed] business id ${businessId}`);

  console.log('[seed] resetting services');
  const { error: servicesDeleteError } = await supabase.from('services').delete().eq('business_id', businessId);
  if (servicesDeleteError) {
    console.error('[seed] services delete failed', servicesDeleteError);
    process.exit(1);
  }
  const { error: servicesInsertError } = await supabase
    .from('services')
    .insert(services.map((s) => ({ ...s, business_id: businessId })));
  if (servicesInsertError) {
    console.error('[seed] services insert failed', servicesInsertError);
    process.exit(1);
  }

  console.log('[seed] resetting business_media');
  const { error: mediaDeleteError } = await supabase.from('business_media').delete().eq('business_id', businessId);
  if (mediaDeleteError) {
    console.error('[seed] media delete failed', mediaDeleteError);
    process.exit(1);
  }
  const { error: mediaInsertError } = await supabase
    .from('business_media')
    .insert(media.map((m) => ({ ...m, business_id: businessId })));
  if (mediaInsertError) {
    console.error('[seed] media insert failed', mediaInsertError);
    process.exit(1);
  }

  console.log('[seed] upserting business_hours by (business_id, day_of_week)');
  const { error: hoursError } = await supabase
    .from('business_hours')
    .upsert(hours.map((h) => ({ ...h, business_id: businessId })), { onConflict: 'business_id,day_of_week' });
  if (hoursError) {
    console.error('[seed] hours upsert failed', hoursError);
    process.exit(1);
  }

  console.log('[seed] done. Page available at /simplygolf365.');
}

main().catch((err) => {
  console.error('[seed] fatal', err);
  process.exit(1);
});
