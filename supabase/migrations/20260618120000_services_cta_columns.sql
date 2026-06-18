-- Per-service CTA columns for the marketing service cards.
--
-- Some tenants' service cards are real action links (Stripe checkout, WhatsApp,
-- an onboarding page, Instagram) rather than the default static "Enquire →".
-- This adds the optional fields the marketing card needs to render that link.
--
-- Everything here is ADDITIVE and idempotent: the columns are nullable with no
-- default, so every existing row (and the booking app) is unaffected — a row
-- with cta_url IS NULL keeps the current "Enquire →" affordance. No backfill.
--
--   cta_label    -> button text, e.g. "Join now" / "Start coaching" / "Enquire"
--   cta_url      -> button destination (https for external, or a site path)
--   price_suffix -> small qualifier shown next to the price, e.g. "/ mo"

alter table public.services
  add column if not exists cta_label text,
  add column if not exists cta_url text,
  add column if not exists price_suffix text;

comment on column public.services.cta_label is 'Marketing service-card CTA button label (e.g. "Join now"). NULL keeps the default static "Enquire →".';
comment on column public.services.cta_url is 'Marketing service-card CTA destination — external https link (Stripe/WhatsApp/Instagram) or a same-site path (e.g. /empire-gym/onboarding.html). NULL keeps the default static "Enquire →".';
comment on column public.services.price_suffix is 'Small qualifier shown next to the price on the marketing card, e.g. "/ mo".';
