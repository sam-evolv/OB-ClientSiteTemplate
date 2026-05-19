/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Seed: SIMply Golf 365.
 *
 * Upserts the SIMply Golf 365 business and its related rows (services,
 * business_media, business_hours) into the OpenBook database. Idempotent
 * by slug for businesses and by (business_id, day_of_week) for hours.
 * Services and media are wiped and re-inserted on each run so the seed
 * data is the source of truth.
 *
 * Run locally:
 *   set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 *   node --env-file=.env.local --experimental-strip-types scripts/seed-simply-golf.ts
 *
 * Uses the service role key. Never deploy this script to a runtime where
 * the service role key is exposed to clients.
 *
 * Source of truth for the design data: reference/simply_golf_v9.jsx
 * and the migration of v9 hardcoded strings into business columns
 * described in reference/openbook_template_brief.md Part 9.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OWNER_ID = process.env.SEED_OWNER_ID;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !OWNER_ID) {
  console.error('Missing env: set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SEED_OWNER_ID');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const BUSINESS_SLUG = 'simplygolf365';

const businessFields = {
  owner_id: OWNER_ID,
  slug: BUSINESS_SLUG,
  name: 'SIMply Golf 365',
  category: 'golf-simulator',
  city: 'Cork',
  address: null,
  address_line: null,
  phone: '087 409 1291',
  email: 'hello@simplygolf365.ie',
  website: 'https://simplygolf365.ie',
  instagram_handle: '@simplygolf365',
  primary_colour: 'pearl',
  secondary_colour: null,
  description: 'Mobile golf simulator. Cork and Munster.',
  tagline: 'Golf. Anywhere you want it.',
  about_long:
    "The idea came over dinner in late 2024. Jack was working in golf at Fota and Old Head, weighing up a move abroad, and did not want it. He wanted to stay in Irish golf, but bring it somewhere new. So he built it: a dome that travels, a screen that does not care about the weather, a way for the people who would never set foot on a course to have a brilliant evening playing one.",
  founder_name: 'Jack Howard',
  founder_photo_url: '/reference/v9-extracted/about-portrait.jpg',
  year_founded: 2025,
  is_live: true,
  website_is_published: true,
  website_custom_domain: 'simplygolf365.ie',
  website_headline: 'Golf, anywhere you want it.',
  website_hero_headline_1: 'We bring',
  website_hero_headline_2: 'the course to you.',
  website_hero_subhead:
    'A 25-foot inflatable dome with a Foresight simulator inside. Built for events, workplaces and private gatherings, anywhere in Munster, rain or shine.',
  website_hero_image_url: '/reference/v9-extracted/hero.jpg',
  website_about_headline: 'Why this exists.',
  logo_url: '/reference/v9-extracted/logo.jpg',
  mission_statement:
    'Our mission is to make premium golf experiences accessible anywhere, anytime. Using cutting-edge Foresight technology, we bring the excitement of the course to events, workplaces, and private gatherings, rain or shine, season after season. We aim to create memorable, social, and inclusive golf experiences that elevate any occasion.',
  mission_highlight_word: 'Foresight',
  travel_zones: [
    { label: 'Zone 1, No travel fee', name: 'Cork and Munster', description: 'Cork city, county and surrounds, no travel fee.', is_primary: true },
    { label: 'Zone 2, Small supplement', name: 'Greater Munster', description: 'Limerick, Tipperary, Kerry, Waterford, small travel supplement.', is_primary: false },
    { label: 'Anywhere else', name: 'Rest of Ireland', description: 'Anywhere in Ireland, quote on enquiry.', is_primary: false }
  ],
  venue_requirements: {
    eyebrow: 'Venue requirements',
    items: [
      { stat: '8 x 8 m', label: 'Floor space' },
      { stat: '8 m', label: 'Ceiling height' },
      { stat: 'Indoor', label: 'Hall, marquee or warehouse' },
      { stat: 'Standard 13A', label: 'Power supply' }
    ],
    callout: 'Not sure if your venue works? Send a photo and we will confirm in under 24 hours.'
  },
  trust_signals: [
    { label: 'PGA Professional' },
    { label: 'Foresight simulator' },
    { label: 'Munster and beyond' },
    { label: 'Bookable for any event' }
  ],
  press_mentions: [
    { outlet: 'Echo Live', title: "Cork's newest golf simulator experience", date: 'Nov 2025' },
    { outlet: 'Cork Golf News', title: 'Jack Howard launches Simply Golf 365', date: 'Nov 2025' },
    { outlet: 'Carrigdhoun', title: "Ireland's First Mobile Golf Simulator", date: 'Dec 2025' }
  ],
  testimonials: [
    {
      quote:
        'Jack ran a half-day for our team, 16 of us, none of us proper golfers. The leaderboard was vicious and the craic was savage. Sorted.',
      author: 'Tech company team lead',
      role: 'Corporate half-day',
      context: 'Cork city, Nov 2025',
      date: '2025-11-14'
    }
  ]
};

const services = [
  { group_name: 'Events and Corporate', name: 'Half-Day Corporate', duration_minutes: 240, price_cents: 65000, description: 'Up to 20 guests. Closest-to-pin, longest-drive, team leaderboard.', sort_order: 1 },
  { group_name: 'Events and Corporate', name: 'Full-Day Corporate', duration_minutes: 480, price_cents: 120000, description: 'Team-building format. Format brief, leaderboards, prizes, branded scorecards.', sort_order: 2 },
  { group_name: 'Events and Corporate', name: 'Stag / Hen Package', duration_minutes: 180, price_cents: 45000, description: 'Group of 10 to 12. Food and drinks tie-ins available.', sort_order: 3 },
  { group_name: 'Events and Corporate', name: 'Christmas Office Party', duration_minutes: 240, price_cents: 75000, description: 'Seasonal pricing. Mulled wine package optional.', sort_order: 4 },
  { group_name: '1-to-1 Coaching', name: '60-min Lesson', duration_minutes: 60, price_cents: 6500, description: 'Swing analysis, technical work, video to take home.', sort_order: 5 },
  { group_name: '1-to-1 Coaching', name: 'Lesson Block x 5', duration_minutes: 300, price_cents: 28000, description: 'Save 45. Structured progression plan with Foresight data.', sort_order: 6 },
  { group_name: '1-to-1 Coaching', name: 'Ladies Get Into Golf', duration_minutes: 60, price_cents: 4000, description: 'Introductory session for new and returning women golfers.', sort_order: 7 },
  { group_name: 'Private Gatherings', name: 'Group of 4', duration_minutes: 120, price_cents: 22000, description: 'Compact setup. Suits home garages and small venues.', sort_order: 8 },
  { group_name: 'Private Gatherings', name: 'Group of 8', duration_minutes: 180, price_cents: 38000, description: 'The popular size. Full dome experience.', sort_order: 9 }
];

const media = [
  { url: '/reference/v9-extracted/gallery-1.jpg', caption: 'Mid-swing on the Foresight simulator', kind: 'interior', sort_order: 1 },
  { url: '/reference/v9-extracted/gallery-2.jpg', caption: 'Inside the dome at a corporate evening event', kind: 'interior', sort_order: 2 },
  { url: '/reference/v9-extracted/gallery-3.jpg', caption: 'Inside the dome, a player at the tee', kind: 'interior', sort_order: 3 },
  { url: '/reference/v9-extracted/gallery-4.jpg', caption: 'Memorable, social, inclusive, by design', kind: 'interior', sort_order: 4 },
  { url: '/reference/v9-extracted/gallery-5.jpg', caption: 'Setup. Two hours from van to first shot.', kind: 'interior', sort_order: 5 }
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
  const { error: servicesDeleteError } = await supabase
    .from('services')
    .delete()
    .eq('business_id', businessId);
  if (servicesDeleteError) {
    console.error('[seed] services delete failed', servicesDeleteError);
    process.exit(1);
  }

  const { error: servicesInsertError } = await supabase
    .from('services')
    .insert(services.map((s) => ({ ...s, business_id: businessId, is_active: true })));
  if (servicesInsertError) {
    console.error('[seed] services insert failed', servicesInsertError);
    process.exit(1);
  }

  console.log('[seed] resetting business_media');
  const { error: mediaDeleteError } = await supabase
    .from('business_media')
    .delete()
    .eq('business_id', businessId);
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
    .upsert(
      hours.map((h) => ({ ...h, business_id: businessId })),
      { onConflict: 'business_id,day_of_week' }
    );
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
