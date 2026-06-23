-- Per-tenant FAQ for the marketing site.
--
-- Adds an optional FAQ list the marketing page renders as its own section. The
-- column is nullable jsonb (array of {q, a}); a tenant with no faq renders no
-- FAQ section, so this is additive and backward-compatible. No backfill.

alter table public.businesses
  add column if not exists faq jsonb;

comment on column public.businesses.faq is 'Marketing FAQ: JSON array of {"q","a"} objects rendered as the on-page FAQ section. NULL/empty hides the section.';
