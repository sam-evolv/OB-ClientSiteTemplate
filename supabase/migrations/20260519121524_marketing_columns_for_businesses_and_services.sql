-- Marketing site columns for businesses and services.
--
-- Adds the fields the marketing site needs that were not already present on
-- the businesses table, and adds group_name to services so the renderer can
-- collapse a flat list into tabs when the data has groups.
--
-- All columns are nullable. Sections that depend on these fields skip render
-- when the field is null. No backfill is required.

-- Email contact on businesses. Confirmed missing during inspection.
alter table public.businesses
  add column if not exists email text;

comment on column public.businesses.email is 'Public contact email address. Rendered as a contact method on the marketing site.';

-- Marketing-only columns on businesses.
alter table public.businesses
  add column if not exists mission_statement text,
  add column if not exists mission_highlight_word text,
  add column if not exists website_hero_headline_1 text,
  add column if not exists website_hero_headline_2 text,
  add column if not exists website_hero_subhead text,
  add column if not exists website_hero_image_url text,
  add column if not exists website_about_headline text,
  add column if not exists travel_zones jsonb,
  add column if not exists press_mentions jsonb,
  add column if not exists trust_signals jsonb,
  add column if not exists venue_requirements jsonb;

comment on column public.businesses.mission_statement is 'Italic mission paragraph displayed in the marketing site mission section. Null = section is not rendered.';
comment on column public.businesses.mission_highlight_word is 'A single upright word inside the italic mission paragraph (e.g. a product or technology name). Renders in Fraunces upright weight 400 inside the italic body.';
comment on column public.businesses.website_hero_headline_1 is 'First line of the hero headline. Marketing site only. Falls back to business.name if null.';
comment on column public.businesses.website_hero_headline_2 is 'Second line of the hero headline. May contain a markdown-style italic span like "the *course to you*."';
comment on column public.businesses.website_hero_subhead is 'Paragraph rendered under the hero headline on the marketing site.';
comment on column public.businesses.website_hero_image_url is 'Hero image specifically for the marketing site, distinct from the booking apps hero_image_url which is used in the customer-facing app.';
comment on column public.businesses.website_about_headline is 'Headline of the about section, e.g. "Why this exists."';
comment on column public.businesses.travel_zones is 'Array of {label, name, description, is_primary} for mobile businesses. Null for fixed-location businesses, which use address_line + business_hours instead.';
comment on column public.businesses.press_mentions is 'Array of {outlet, title, date, url?} for the press section.';
comment on column public.businesses.trust_signals is 'Array of {label} for the hero trust pills.';
comment on column public.businesses.venue_requirements is 'For mobile businesses: optional {eyebrow, items: [{stat, label}], callout} describing what a venue needs.';

-- Service group label on services. If all services for a business have null
-- group_name the renderer uses a flat list. If any service has a group_name
-- the renderer uses tabbed groups.
alter table public.services
  add column if not exists group_name text;

comment on column public.services.group_name is 'Optional service group label, e.g. "Events and Corporate" or "1-to-1 Coaching". Drives ServicesTabbed vs ServicesFlat at render time.';

-- Indexes. Slug lookups are the hot path for the marketing site.
create index if not exists businesses_slug_idx on public.businesses (slug);
create index if not exists businesses_website_published_idx
  on public.businesses (slug)
  where website_is_published = true;

-- Anonymous read policy for published marketing sites. The existing
-- public_read_live policy already permits anonymous SELECT when is_live is
-- true. This additional policy makes the marketing-read intent explicit and
-- future-proofs the case where a business may be website_is_published without
-- being is_live for the booking app.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'businesses'
      and policyname = 'businesses_public_read_website'
  ) then
    create policy businesses_public_read_website
      on public.businesses
      for select
      to anon, authenticated
      using (website_is_published = true);
  end if;
end
$$;
