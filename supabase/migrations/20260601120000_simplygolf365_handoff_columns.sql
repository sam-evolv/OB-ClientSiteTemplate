-- SIMply Golf 365 handoff columns (README §5).
--
-- Adds the marketing fields the handoff design needs that were not already on
-- the live schema (confirmed against project nrntaowmmemhjfxjqjch before
-- writing this migration). Everything here is ADDITIVE and idempotent:
--   * new columns are nullable (or have safe defaults),
--   * the only constraint change widens an allowlist (business_media.kind),
-- so existing rows and the booking app are unaffected. No backfill required.
--
-- Where the live schema already had an equivalent column, that column is reused
-- rather than duplicated (README §5: "confirm against the live schema before
-- adding"):
--   founded            -> year_founded            (existing)
--   instagram (handle) -> instagram_handle         (existing)
--   about.body         -> website_about_body (new) + about_long (existing) kept in sync
--   service duration   -> duration_label (new); duration_minutes (existing) stays for booking
--   service price null -> price_cents (existing, NOT NULL) seeded as 0 = "On enquiry"

-- ── businesses ──────────────────────────────────────────────────────────────
alter table public.businesses
  add column if not exists website_hero_variant text,
  add column if not exists website_about_body text,
  add column if not exists founder_role text,
  add column if not exists founder_bio text,
  add column if not exists instagram_url text,
  add column if not exists website_stats jsonb;

comment on column public.businesses.website_hero_variant is 'Marketing hero layout: photo | split | type. The chosen value of the design Tweaks "hero variant" control. SIMply Golf = photo.';
comment on column public.businesses.website_about_body is 'About-section body paragraph for the marketing site (README §5 about.body).';
comment on column public.businesses.founder_role is 'Founder role/title, e.g. "PGA Professional · Founder". Shown on the founder chip in the About section.';
comment on column public.businesses.founder_bio is 'Short founder biography. Available for the About section / future use.';
comment on column public.businesses.instagram_url is 'Full Instagram profile URL. instagram_handle holds the @handle; this holds the link target.';
comment on column public.businesses.website_stats is 'Array of {value, prefix?, suffix?, label} for the stats bar. Numeric values count up on scroll.';

-- ── services ────────────────────────────────────────────────────────────────
alter table public.services
  add column if not exists duration_label text,
  add column if not exists is_popular boolean not null default false,
  add column if not exists group_blurb text;

comment on column public.services.duration_label is 'Free-text duration shown on the marketing service card ("4 hours", "5 × 60 min", "Bespoke"). duration_minutes remains the booking-app source of truth.';
comment on column public.services.is_popular is 'Marks the "Most popular" decoy card in a service group.';
comment on column public.services.group_blurb is 'Italic blurb shown above the cards for a service group (stored on each service in the group).';

-- ── business_media ──────────────────────────────────────────────────────────
-- Widen the kind allowlist to include the handoff''s semantic kinds, and add the
-- columns needed for video gallery items. Widening a CHECK is non-breaking.
alter table public.business_media drop constraint if exists business_media_kind_check;
alter table public.business_media
  add constraint business_media_kind_check
  check (kind in ('interior', 'exterior', 'service', 'team', 'logo', 'hero', 'about', 'gallery'));

alter table public.business_media
  add column if not exists media_type text not null default 'image',
  add column if not exists video_url text,
  add column if not exists alt text,
  add column if not exists label text;

alter table public.business_media drop constraint if exists business_media_media_type_check;
alter table public.business_media
  add constraint business_media_media_type_check
  check (media_type in ('image', 'video'));

comment on column public.business_media.media_type is 'image | video. For video items, url is the poster and video_url is the clip.';
comment on column public.business_media.video_url is 'Clip URL for video media (hero background loop, gallery video items). Null for images.';
comment on column public.business_media.alt is 'Alt text for the media.';
comment on column public.business_media.label is 'Optional overlay label on a gallery video tile, e.g. "In the dome".';
