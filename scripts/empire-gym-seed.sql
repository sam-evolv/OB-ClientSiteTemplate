-- Empire Gym — businesses row + services + business_media + business_hours.
--
-- Mirrors scripts/seed-simply-golf.ts in intent: this is the row-level seed that
-- backs the live empire-gym tenant on the shared production project
-- (nrntaowmmemhjfxjqjch). It is the source-of-truth record of the row's contents
-- and a runnable replay/revert artifact, kept faithful to live production.
--
-- Requires migrations:
--   * 20260618120000_services_cta_columns.sql       (cta_label / cta_url / price_suffix)
--   * 20260618153000_businesses_privacy_terms_urls.sql (privacy_url / terms_url)
--   * 20260618170000_services_price_note.sql        (price_note — student rate line)
--
-- Reuse decisions:
--   * primary_colour: 'crimson' (existing named-colour token, closest to the
--     Empire brand red #E0241B; matches the precedent set by Dublin Iron Gym).
--   * website_hero_variant: 'photo' (existing variant; the design uses a hero
--     image + autoplay video, which is exactly what 'photo' supports).
--   * service_groups: rendered via the existing tabbed Events section by
--     setting group_name + group_blurb + sort_order — three tabs:
--     Gym membership / Train with Stephen / Train with Dayana.
--   * location: rendered via the existing LocationHours section (fixed address).
--   * No template code changes required.
--
-- Assets: every URL on this row points at the `business-assets` storage bucket
-- under the business id prefix
--   2ec3b899-e539-4a07-93f3-16682ad2ef86/
--     logo.png
--     interior.png
--     coaches.png
--     hf_20260616_161623_97589bd6-7bad-48a9-b09f-6b2d75bd004f.png   (hero still)
--     hf_20260616_161710_a24bf8a8-eaee-4b49-bb5f-124790b812f9.mp4   (hero video)
--
-- Idempotent by design: the businesses row UPSERTs on id, and the three child
-- tables are wiped for this business_id then re-inserted, so re-running this
-- file converges the live row back to exactly this state.

-- ── child rows: clean replace ──────────────────────────────────────────────
DELETE FROM public.business_hours WHERE business_id = '2ec3b899-e539-4a07-93f3-16682ad2ef86';
DELETE FROM public.business_media WHERE business_id = '2ec3b899-e539-4a07-93f3-16682ad2ef86';
DELETE FROM public.services       WHERE business_id = '2ec3b899-e539-4a07-93f3-16682ad2ef86';

-- ── businesses row (upsert on id) ──────────────────────────────────────────
INSERT INTO public.businesses (
  id, owner_id, name, slug, category, city,
  description, tagline, year_founded,
  primary_colour, logo_url, hero_image_url, cover_image_url, processed_icon_url, gallery_urls,
  address, address_line,
  email, phone, instagram_handle, instagram_url,
  website, website_custom_domain, website_url,
  website_hero_headline_1, website_hero_headline_2, website_hero_subhead, website_hero_variant, website_hero_image_url,
  website_about_headline, website_about_body, about_long,
  founder_name, founder_role, founder_bio, founder_photo_url,
  mission_statement, mission_highlight_word,
  travel_zones, venue_requirements,
  website_stats, trust_signals, press_mentions, testimonials,
  plan, is_live, website_is_published,
  booking_mode, payment_acceptance,
  privacy_url, terms_url
) VALUES (
  '2ec3b899-e539-4a07-93f3-16682ad2ef86',
  'd5835ed3-6f8a-4251-a41f-4cfae5300cc4',
  'Empire Gym',
  'empire-gym',
  'Fitness & Wellness',
  'Cork',
  'Inclusive strength gym on Matthew Hill, Cork. Strength, discipline and respect, built for every body and every level.',
  'Inclusive strength gym · Matthew Hill, Cork.',
  2025,
  'crimson',
  'https://nrntaowmmemhjfxjqjch.supabase.co/storage/v1/object/public/business-assets/2ec3b899-e539-4a07-93f3-16682ad2ef86/logo.png',
  'https://nrntaowmmemhjfxjqjch.supabase.co/storage/v1/object/public/business-assets/2ec3b899-e539-4a07-93f3-16682ad2ef86/hf_20260616_161623_97589bd6-7bad-48a9-b09f-6b2d75bd004f.png',
  'https://nrntaowmmemhjfxjqjch.supabase.co/storage/v1/object/public/business-assets/2ec3b899-e539-4a07-93f3-16682ad2ef86/hf_20260616_161623_97589bd6-7bad-48a9-b09f-6b2d75bd004f.png',
  'https://nrntaowmmemhjfxjqjch.supabase.co/storage/v1/object/public/business-assets/2ec3b899-e539-4a07-93f3-16682ad2ef86/logo.png',
  ARRAY[
    'https://nrntaowmmemhjfxjqjch.supabase.co/storage/v1/object/public/business-assets/2ec3b899-e539-4a07-93f3-16682ad2ef86/interior.png',
    'https://nrntaowmmemhjfxjqjch.supabase.co/storage/v1/object/public/business-assets/2ec3b899-e539-4a07-93f3-16682ad2ef86/coaches.png',
    'https://nrntaowmmemhjfxjqjch.supabase.co/storage/v1/object/public/business-assets/2ec3b899-e539-4a07-93f3-16682ad2ef86/hf_20260616_161623_97589bd6-7bad-48a9-b09f-6b2d75bd004f.png'
  ]::text[],
  'Unit 3, Matthew Hill',
  'T12 CR22',
  'empiregymcork@outlook.com',
  NULL,
  '@empiregym.cork',
  'https://www.instagram.com/empiregym.cork/',
  'https://empiregym.ie',
  'www.empiregym.ie',
  'https://www.empiregym.ie',
  'Build your',
  'inner empire.',
  'A new kind of gym in Cork — serious iron, zero ego. Strength, discipline and respect, built rep by rep, for every body and every level. Walk in however you are. Walk out stronger.',
  'photo',
  'https://nrntaowmmemhjfxjqjch.supabase.co/storage/v1/object/public/business-assets/2ec3b899-e539-4a07-93f3-16682ad2ef86/hf_20260616_161623_97589bd6-7bad-48a9-b09f-6b2d75bd004f.png',
  'A gym for all. Built to last.',
  'Empire Gym opened its doors in Cork with one belief: real strength is for everyone. Kitted out with proper plate-loaded machines, racks, free weights and the space to actually train, it''s a gym built for results — but it''s the atmosphere that sets it apart. Whether you''re chasing a stage, a PB, or just a healthier, stronger you, you''ll find a welcome and a community that has your back. Strength, discipline and respect aren''t just words on the wall here — they''re how the place runs.',
  'Empire Gym opened its doors in Cork with one belief: real strength is for everyone. Kitted out with proper plate-loaded machines, racks, free weights and the space to actually train, it''s a gym built for results — but it''s the atmosphere that sets it apart. Whether you''re chasing a stage, a PB, or just a healthier, stronger you, you''ll find a welcome and a community that has your back. Strength, discipline and respect aren''t just words on the wall here — they''re how the place runs.',
  'The Empire team',
  'Coaching · Matthew Hill, Cork',
  NULL,
  'https://nrntaowmmemhjfxjqjch.supabase.co/storage/v1/object/public/business-assets/2ec3b899-e539-4a07-93f3-16682ad2ef86/coaches.png',
  'Everyone''s welcome here — first session or thousandth, lifting heavy or just starting out. No ego, no judgement, just strength, discipline and respect, built one honest session at a time. This is where you build your inner empire.',
  'strength, discipline and respect',
  NULL,
  NULL,
  '[{"value":"For all","label":"every body, every level"},{"value":"Open 7 days","label":"train on your schedule"},{"value":"No ego","label":"just the work, and respect"},{"value":"Cork","label":"Unit 3, Matthew Hill"}]'::jsonb,
  '[{"label":"A gym for all levels"},{"label":"Strength · Discipline · Respect"},{"label":"Coaching to competition"},{"label":"Matthew Hill, Cork"}]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  'complete',
  true,
  true,
  'enquiry',
  'card',
  '/empire-gym/privacy.html',
  '/empire-gym/terms.html'
)
ON CONFLICT (id) DO UPDATE SET
  owner_id                 = EXCLUDED.owner_id,
  name                     = EXCLUDED.name,
  slug                     = EXCLUDED.slug,
  category                 = EXCLUDED.category,
  city                     = EXCLUDED.city,
  description              = EXCLUDED.description,
  tagline                  = EXCLUDED.tagline,
  year_founded             = EXCLUDED.year_founded,
  primary_colour           = EXCLUDED.primary_colour,
  logo_url                 = EXCLUDED.logo_url,
  hero_image_url           = EXCLUDED.hero_image_url,
  cover_image_url          = EXCLUDED.cover_image_url,
  processed_icon_url       = EXCLUDED.processed_icon_url,
  gallery_urls             = EXCLUDED.gallery_urls,
  address                  = EXCLUDED.address,
  address_line             = EXCLUDED.address_line,
  email                    = EXCLUDED.email,
  phone                    = EXCLUDED.phone,
  instagram_handle         = EXCLUDED.instagram_handle,
  instagram_url            = EXCLUDED.instagram_url,
  website                  = EXCLUDED.website,
  website_custom_domain    = EXCLUDED.website_custom_domain,
  website_url              = EXCLUDED.website_url,
  website_hero_headline_1  = EXCLUDED.website_hero_headline_1,
  website_hero_headline_2  = EXCLUDED.website_hero_headline_2,
  website_hero_subhead     = EXCLUDED.website_hero_subhead,
  website_hero_variant     = EXCLUDED.website_hero_variant,
  website_hero_image_url   = EXCLUDED.website_hero_image_url,
  website_about_headline   = EXCLUDED.website_about_headline,
  website_about_body       = EXCLUDED.website_about_body,
  about_long               = EXCLUDED.about_long,
  founder_name             = EXCLUDED.founder_name,
  founder_role             = EXCLUDED.founder_role,
  founder_bio              = EXCLUDED.founder_bio,
  founder_photo_url        = EXCLUDED.founder_photo_url,
  mission_statement        = EXCLUDED.mission_statement,
  mission_highlight_word   = EXCLUDED.mission_highlight_word,
  travel_zones             = EXCLUDED.travel_zones,
  venue_requirements       = EXCLUDED.venue_requirements,
  website_stats            = EXCLUDED.website_stats,
  trust_signals            = EXCLUDED.trust_signals,
  press_mentions           = EXCLUDED.press_mentions,
  testimonials             = EXCLUDED.testimonials,
  plan                     = EXCLUDED.plan,
  is_live                  = EXCLUDED.is_live,
  website_is_published     = EXCLUDED.website_is_published,
  booking_mode             = EXCLUDED.booking_mode,
  payment_acceptance       = EXCLUDED.payment_acceptance,
  privacy_url              = EXCLUDED.privacy_url,
  terms_url                = EXCLUDED.terms_url,
  updated_at               = now();

-- ── services (3 tabbed groups; price_cents=0 = "On enquiry" per template) ──
-- cta_label / cta_url make each card a real button (Stripe checkout, WhatsApp,
-- the onboarding page, or Instagram). price_suffix renders next to the price
-- ("/ mo"); price_note renders a secondary line under it (the student rate).
-- Membership: regular full prices headline; the student rate is shown per card
-- via price_note (Monthly €69.99/€59.99, 3mo €209.97/€193, 6mo €419.94/€357,
-- annual €839.88/€629). All membership tiers share one Stripe link for now.
INSERT INTO public.services
  (business_id, name, description, duration_minutes, duration_label, price_cents, is_active, sort_order, group_name, group_blurb, is_popular, cta_label, cta_url, price_suffix, price_note)
VALUES
  ('2ec3b899-e539-4a07-93f3-16682ad2ef86', 'Monthly',  'Full gym access, cancel any time. The simplest way in.',
    30, 'Rolling · no contract', 6999, true,  1, 'Gym membership', 'Full access to the floor, the kit and the community — student rates on every plan.', true,
    'Join now', 'https://buy.stripe.com/14A5kDbcL20B54z40s0sU00', '/ mo', 'Students €59.99 / mo'),
  ('2ec3b899-e539-4a07-93f3-16682ad2ef86', '3 months', 'Three months of full access, paid up front.',
    90, 'Up-front', 20997, true,  2, 'Gym membership', 'Full access to the floor, the kit and the community — student rates on every plan.', false,
    'Join now', 'https://buy.stripe.com/14A5kDbcL20B54z40s0sU00', NULL, 'Students €193'),
  ('2ec3b899-e539-4a07-93f3-16682ad2ef86', '6 months', 'Six months of Empire — better value for the committed.',
    180, 'Up-front', 41994, true,  3, 'Gym membership', 'Full access to the floor, the kit and the community — student rates on every plan.', false,
    'Join now', 'https://buy.stripe.com/14A5kDbcL20B54z40s0sU00', NULL, 'Students €357'),
  ('2ec3b899-e539-4a07-93f3-16682ad2ef86', '12 months', 'A full year on the floor — our best rate.',
    365, 'Best value', 83988, true,  4, 'Gym membership', 'Full access to the floor, the kit and the community — student rates on every plan.', true,
    'Join now', 'https://buy.stripe.com/14A5kDbcL20B54z40s0sU00', NULL, 'Students €629'),
  ('2ec3b899-e539-4a07-93f3-16682ad2ef86', 'Day pass', 'Just passing through? A full day on the floor.',
    1, '1 day', 1500, true,  6, 'Gym membership', 'Full access to the floor, the kit and the community — student rates on every plan.', false,
    'Get a day pass', 'https://buy.stripe.com/14A5kDbcL20B54z40s0sU00', NULL, NULL),

  ('2ec3b899-e539-4a07-93f3-16682ad2ef86', 'Online Coaching', 'Fully tailored training, nutrition and check-ins. After checkout you''ll complete a short onboarding form and get your coaching packs.',
    30, 'Monthly · SS Coaching', 0, true,  7, 'Train with Stephen', 'SS Coaching — online coaching with Stephen Sharpe. Buy, complete your onboarding, and your plan is built around you.', true,
    'Start coaching', 'https://buy.stripe.com/14A7sL82N7Tr9Mb75r8IU0u', '/ mo', NULL),
  ('2ec3b899-e539-4a07-93f3-16682ad2ef86', 'In-person PT', 'One-to-one sessions with Stephen on the Empire floor. Enquire for block rates.',
    60, 'Per session / block', 0, true,  8, 'Train with Stephen', 'SS Coaching — online coaching with Stephen Sharpe. Buy, complete your onboarding, and your plan is built around you.', false,
    'Enquire on WhatsApp', 'https://wa.me/353879943270', NULL, NULL),
  ('2ec3b899-e539-4a07-93f3-16682ad2ef86', 'Already signed up?', 'Just purchased coaching? Complete your client onboarding form here and grab your info + start-up packs.',
    15, 'New clients', 0, true,  9, 'Train with Stephen', 'SS Coaching — online coaching with Stephen Sharpe. Buy, complete your onboarding, and your plan is built around you.', false,
    'Complete onboarding', '/empire-gym/onboarding.html', NULL, NULL),

  ('2ec3b899-e539-4a07-93f3-16682ad2ef86', 'Personal training', 'Tailored one-to-one coaching with Dayana, built around your goals and pace.',
    60, 'Per session / block', 0, true, 10, 'Train with Dayana', 'One-to-one and online coaching with Dayana. Get in touch to find the right plan for you.', true,
    'Enquire', 'https://www.instagram.com/empiregym.cork/', NULL, NULL),
  ('2ec3b899-e539-4a07-93f3-16682ad2ef86', 'Online coaching', 'Remote training and nutrition coaching with check-ins. Message to get started.',
    30, 'Monthly', 0, true, 11, 'Train with Dayana', 'One-to-one and online coaching with Dayana. Get in touch to find the right plan for you.', false,
    'Enquire', 'https://www.instagram.com/empiregym.cork/', NULL, NULL);

-- ── business_media (logo / hero / about / gallery x 3) ─────────────────────
-- Every asset lives in the business-assets bucket under the business id prefix
-- — see scripts/empire-gym-assets.md for the canonical file list.
INSERT INTO public.business_media (business_id, kind, media_type, url, video_url, alt, caption, label, sort_order) VALUES
  ('2ec3b899-e539-4a07-93f3-16682ad2ef86', 'logo',  'image',
    'https://nrntaowmmemhjfxjqjch.supabase.co/storage/v1/object/public/business-assets/2ec3b899-e539-4a07-93f3-16682ad2ef86/logo.png',
    NULL, 'Empire Gym', NULL, NULL, 0),
  ('2ec3b899-e539-4a07-93f3-16682ad2ef86', 'hero',  'image',
    'https://nrntaowmmemhjfxjqjch.supabase.co/storage/v1/object/public/business-assets/2ec3b899-e539-4a07-93f3-16682ad2ef86/hf_20260616_161623_97589bd6-7bad-48a9-b09f-6b2d75bd004f.png',
    'https://nrntaowmmemhjfxjqjch.supabase.co/storage/v1/object/public/business-assets/2ec3b899-e539-4a07-93f3-16682ad2ef86/hf_20260616_161710_a24bf8a8-eaee-4b49-bb5f-124790b812f9.mp4',
    'The glowing red EMPIRE emblem on the gym wall, weights racked in the dark', NULL, NULL, 0),
  ('2ec3b899-e539-4a07-93f3-16682ad2ef86', 'about', 'image',
    'https://nrntaowmmemhjfxjqjch.supabase.co/storage/v1/object/public/business-assets/2ec3b899-e539-4a07-93f3-16682ad2ef86/coaches.png',
    NULL, 'Empire Gym coaching — competitor and coach',
    'Coaching that takes you all the way — stage included.', NULL, 0),
  ('2ec3b899-e539-4a07-93f3-16682ad2ef86', 'gallery', 'image',
    'https://nrntaowmmemhjfxjqjch.supabase.co/storage/v1/object/public/business-assets/2ec3b899-e539-4a07-93f3-16682ad2ef86/interior.png',
    NULL, 'The Empire Gym floor — racks, plates and mirrors', 'the floor', NULL, 0),
  ('2ec3b899-e539-4a07-93f3-16682ad2ef86', 'gallery', 'image',
    'https://nrntaowmmemhjfxjqjch.supabase.co/storage/v1/object/public/business-assets/2ec3b899-e539-4a07-93f3-16682ad2ef86/coaches.png',
    NULL, 'Empire coaching — competitor and coach', 'coaching to the stage', NULL, 1),
  ('2ec3b899-e539-4a07-93f3-16682ad2ef86', 'gallery', 'image',
    'https://nrntaowmmemhjfxjqjch.supabase.co/storage/v1/object/public/business-assets/2ec3b899-e539-4a07-93f3-16682ad2ef86/hf_20260616_161623_97589bd6-7bad-48a9-b09f-6b2d75bd004f.png',
    NULL, 'The glowing EMPIRE emblem on the gym wall', 'welcome to the Empire', NULL, 2);

-- ── business_hours (Mon–Fri 05:00–23:00, Sat–Sun 08:00–20:00) ──────────────
-- day_of_week follows the Postgres/JS convention: 0 = Sunday … 6 = Saturday.
INSERT INTO public.business_hours (business_id, day_of_week, is_open, is_closed, open_time, close_time) VALUES
  ('2ec3b899-e539-4a07-93f3-16682ad2ef86', 0, true, false, '08:00:00', '20:00:00'),
  ('2ec3b899-e539-4a07-93f3-16682ad2ef86', 1, true, false, '05:00:00', '23:00:00'),
  ('2ec3b899-e539-4a07-93f3-16682ad2ef86', 2, true, false, '05:00:00', '23:00:00'),
  ('2ec3b899-e539-4a07-93f3-16682ad2ef86', 3, true, false, '05:00:00', '23:00:00'),
  ('2ec3b899-e539-4a07-93f3-16682ad2ef86', 4, true, false, '05:00:00', '23:00:00'),
  ('2ec3b899-e539-4a07-93f3-16682ad2ef86', 5, true, false, '05:00:00', '23:00:00'),
  ('2ec3b899-e539-4a07-93f3-16682ad2ef86', 6, true, false, '08:00:00', '20:00:00');
