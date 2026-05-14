# OpenBook Client Site Template

A single-page, data-driven Next.js template for premium public websites on OpenBook.

The template renders one agency-grade marketing page per local Irish service business using data from Supabase. It is designed for `slug.openbook.ie`, custom domains, and fast iteration without code changes per customer.

## Principles

- One template, infinite businesses.
- Mobile-first, booking-first, single-scroll.
- Dark OpenBook visual system: `#080808`, gold, and one restrained business accent.
- Type-led by default; photography supports the story rather than carrying weak content.
- Server-rendered, statically revalidated, tiny client JavaScript.
- No stock images, carousels, popups, theme switchers, or generic SaaS blocks.

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000/evolv-performance` for the demo page.

## Environment

```bash
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=https://openbook.ie
MAPBOX_TOKEN=
```

If Supabase variables are not set, the app renders a demo business so the visual system can be reviewed locally.

## Expected Supabase Shape

The page expects a `businesses` table row joined to `services` and `business_hours`:

- `name`, `slug`, `category`, `primary_colour`
- optional content such as `tagline`, `website_headline`, `about_long`, `hero_image_url`, `gallery_urls`, `logo_url`, address, contact, socials, testimonials, founder data, amenities, transport and parking notes
- joined `services` with `name`, `duration`, `price`, `description`, optional `category`
- joined `business_hours` with weekday rows

The query lives in `lib/business.ts` and can be adjusted to match final production table names without changing the presentation layer.
