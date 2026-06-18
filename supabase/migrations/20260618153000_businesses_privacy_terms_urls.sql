-- Per-tenant Privacy Policy + Terms of Service URL slots on businesses.
--
-- Some tenants publish their own legal pages (Privacy Policy + Terms of Service)
-- that the marketing footer should link to — required under GDPR (privacy
-- notice) and Stripe's merchant terms + the EU Consumer Rights Directive (terms
-- of sale) for any tenant that collects personal data or sells via Stripe.
--
-- Everything here is ADDITIVE and idempotent: the columns are nullable with no
-- default, so every existing row (and the booking app) is unaffected — a row
-- with privacy_url IS NULL and terms_url IS NULL keeps the footer exactly as it
-- renders today. No backfill.
--
--   privacy_url -> URL to the tenant's Privacy Policy (https for external, or a
--                  same-site path e.g. /empire-gym/privacy.html)
--   terms_url   -> URL to the tenant's Terms of Service (same convention)

alter table public.businesses
  add column if not exists privacy_url text,
  add column if not exists terms_url text;

comment on column public.businesses.privacy_url is 'Marketing-footer link to the tenant''s Privacy Policy. NULL hides the link.';
comment on column public.businesses.terms_url is 'Marketing-footer link to the tenant''s Terms of Service. NULL hides the link.';
