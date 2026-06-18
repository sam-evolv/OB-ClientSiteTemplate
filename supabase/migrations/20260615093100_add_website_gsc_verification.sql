-- Per-tenant Google Search Console verification token.
--
-- Adds website_gsc_verification to public.businesses so each client site can be
-- verified as a URL-prefix property in Google Search Console via the HTML meta
-- tag method, with no per-business DNS change or file upload. The marketing site
-- emits <meta name="google-site-verification" content="..."> into the matched
-- tenant's <head> (custom-domain host) when this column is set; tenants without
-- a token render no verification tag.
--
-- Store ONLY the raw token value from Google's meta-tag method (the long
-- content string), not the whole tag. Nullable and additive: existing rows and
-- the booking app are unaffected. No backfill required.

alter table public.businesses
  add column if not exists website_gsc_verification text;

comment on column public.businesses.website_gsc_verification is
  'Google Search Console site-verification token: the raw content value from the HTML meta-tag method, not the whole tag. Rendered as <meta name="google-site-verification"> on the tenant''s custom-domain marketing site. Null = no verification tag emitted.';
