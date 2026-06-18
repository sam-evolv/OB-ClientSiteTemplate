-- Secondary price line for the marketing service card (e.g. a student rate).
--
-- Some tenants advertise a second price alongside the headline one — most
-- commonly a student/concession rate ("Students €193"). This adds the optional
-- field the card renders under the price.
--
-- Additive and idempotent: the column is nullable with no default, so every
-- existing row keeps rendering exactly as today — a row with price_note IS NULL
-- shows only the headline price. No backfill.
--
--   price_note -> free-text line shown under the price, e.g. "Students €193"
--                 or "Students €59.99 / mo".

alter table public.services
  add column if not exists price_note text;

comment on column public.services.price_note is 'Marketing service-card secondary price line shown under the price, e.g. "Students €193". NULL shows only the headline price.';
