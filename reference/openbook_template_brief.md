# OpenBook customer site template, production build brief

This brief specifies the production code for the OpenBook customer marketing site. The visual design is locked in `simply_golf_v9.jsx`, which you should read first as the visual reference. This brief describes how to translate that artifact into production Next.js and Supabase code that scales across many businesses.

The artifact is not production code. It is a sealed JSX file with inline base64 images, hardcoded business data, inline styles, and no SSR considerations. Treat it as the design spec, not as code to copy.

---

## Part 1, Context

OpenBook is an AI-first booking platform for Irish SMBs. Each customer gets a public marketing site at `[slug].openbook.ie` or a custom domain like `simplygolf365.ie`. The first customer is SIMply Golf 365.

### Sam's working preferences

- No em-dashes anywhere. Use commas, colons, or full stops. Hard rule.
- Triage trees for any non-trivial decision.
- Stability over clever refactors.
- Direct style, no fluff.
- Timezone Europe/Dublin.
- Premium design is mandatory.

---

## Part 2, Architectural model

A business has an ordered list of sections, not a flat field set.

```ts
type Business = {
  id: string
  slug: string
  name: string
  primary_colour: string
  domain: string | null
  sections: Section[]
}

type Section =
  | { type: 'hero_photo'; display_order: number; config: ...; content: HeroPhotoContent }
  | { type: 'hero_type_led'; ... }
  | { type: 'trust_bar'; ... }
  | { type: 'mission'; ... }
  | { type: 'services_tabbed'; ... }
  | { type: 'services_flat'; ... }
  | { type: 'gallery_mosaic'; ... }
  | { type: 'location_fixed'; ... }
  | { type: 'location_mobile'; ... }
  | { type: 'social_proof_press'; ... }
  | { type: 'social_proof_reviews'; ... }
  | { type: 'about'; ... }
  | { type: 'contact'; ... }
```

The page maps over `business.sections.sort((a, b) => a.display_order - b.display_order)`. StickyNav, StickyBookBar, and Footer are page chrome, not sections.

### Database schema

Three tables: `businesses`, `sections`, `media`. Section content is JSONB on the sections row. Media is referenced from section content by `media_id` and joined at fetch time so components receive resolved URLs.

```sql
create table businesses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text,
  primary_colour text default '#F5F5F4',
  domain text unique,
  phone text,
  email text,
  instagram text,
  category text not null,
  founded_year int,
  cta_primary_label text default 'Book',
  cta_sticky_label text default 'Book',
  cta_final_label text default 'Get in touch',
  is_live boolean default false,
  owner_id uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create type section_type as enum (
  'hero_photo', 'hero_type_led',
  'trust_bar', 'mission',
  'services_tabbed', 'services_flat',
  'gallery_mosaic',
  'location_fixed', 'location_mobile',
  'social_proof_press', 'social_proof_reviews',
  'about', 'contact'
);

create table sections (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  type section_type not null,
  display_order int not null,
  config jsonb not null default '{}'::jsonb,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (business_id, display_order)
);

create table media (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  storage_path text not null,
  url text not null,
  blur_data_url text,
  alt text,
  width int,
  height int,
  type text default 'image',
  created_at timestamptz default now()
);
```

### RLS

Anonymous read for `is_live = true` businesses. Authenticated owner read/write for `auth.uid() = owner_id`.

### Section content shapes

`hero_photo`: `{ headline_line_1, headline_line_2, italic_accent_phrase, subhead, hero_image_id, primary_cta: { label, target_section }, secondary_cta? }`

`hero_type_led`: same as hero_photo but with `background: 'plain' | 'gradient'` and no hero_image_id

`trust_bar`: `{ pills: Array<{ label }> }`

`mission`: `{ statement, highlight_word?, signed_by? }`

`services_tabbed`: `{ intro_headline, intro_subhead?, italic_accent_phrase?, groups: Array<{ id, title, blurb, services: Array<{ name, duration, price: number|null, description, popular }> }> }`

`services_flat`: `{ intro_headline, intro_subhead?, italic_accent_phrase?, services: Array<{ name, duration, price, description, popular }> }`

`gallery_mosaic`: `{ intro_headline, italic_accent_phrase?, eyebrow, fallback_label, items: Array<{ type: 'image', media_id, caption? } | { type: 'video', poster_media_id, video_url, label?, caption? }> }`

`location_fixed`: `{ eyebrow, headline, italic_accent_phrase?, subhead, address_line_1, address_line_2?, city, eircode, parking?, public_transport?, hours: { mon, tue, ... }, map: { lat, lng, embed_url? } }`

`location_mobile`: `{ eyebrow, headline, italic_accent_phrase?, subhead, zones: Array<{ label, name, description, is_primary }>, venue_requirements?: { eyebrow, items: Array<{ stat, label }>, callout } }`

`social_proof_press`: `{ eyebrow, headline, italic_accent_phrase?, press: Array<{ outlet, title, date, url? }>, founder_quote?: { text, attribution } }`

`social_proof_reviews`: `{ eyebrow, headline, reviews: Array<{ quote, author, role?, context?, photo_media_id?, date, rating? }> }`

`about`: `{ eyebrow, headline, body, founder: { name, role, bio }, portrait_media_id?, portrait_caption? }`

`contact`: `{ headline, italic_accent_phrase?, subhead, contact_methods: Array<{ type, value, label }>, cta_label, cta_action: 'mailto' | 'tel' | 'booking_form' }`

---

## Part 3, Component architecture

```
app/(public)/[slug]/
  page.tsx
  not-found.tsx
  opengraph-image.tsx
components/sections/
  HeroPhoto.tsx, HeroTypeLed.tsx, TrustBar.tsx, Mission.tsx,
  ServicesTabbed.tsx, ServicesFlat.tsx, GalleryMosaic.tsx,
  LocationFixed.tsx, LocationMobile.tsx,
  SocialProofPress.tsx, SocialProofReviews.tsx,
  About.tsx, Contact.tsx
components/chrome/
  StickyNav.tsx, StickyBookBar.tsx, Footer.tsx, FilmGrain.tsx
components/primitives/
  BusinessImage.tsx, BusinessVideo.tsx, CTAButton.tsx,
  Eyebrow.tsx, SectionHeader.tsx
lib/
  supabase.ts
  fonts.ts
  schemas/sections.ts
  queries/business.ts
  tokens.ts
  utils/scroll.ts
```

### Renderer

```tsx
const COMPONENTS = {
  hero_photo: HeroPhoto,
  // ... etc
} as const

export function renderSection(section: Section, business: Business) {
  const Component = COMPONENTS[section.type]
  if (!Component) {
    console.warn(`Unknown section type: ${section.type}`)
    return null
  }
  return <Component key={section.id} section={section as any} business={business} accent={business.primary_colour} />
}
```

### Component contract

```tsx
type SectionProps<T extends Section['type']> = {
  section: Extract<Section, { type: T }>
  business: Business
  accent: string
}
```

### Variant logic

Sections handle their own sparse-data fallbacks. A `services_tabbed` with one group collapses to `services_flat` automatically. A `gallery_mosaic` with fewer items collapses its grid responsively. When in doubt, fail gracefully and silently rather than rendering a broken section.

---

## Part 4, Visual implementation

### Fonts

```ts
import { Fraunces, Geist, Geist_Mono } from 'next/font/google'
export const fraunces = Fraunces({ subsets: ['latin'], display: 'swap', axes: ['opsz', 'SOFT'], variable: '--font-fraunces' })
export const geist = Geist({ subsets: ['latin'], display: 'swap', variable: '--font-geist' })
export const geistMono = Geist_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-geist-mono' })
```

Body default Fraunces. UI uses Geist via Tailwind `font-sans`.

### Design tokens

```css
:root {
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.4), 0 1px 1px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3);
  --shadow-lg: 0 12px 36px rgba(0,0,0,0.6), 0 6px 12px rgba(0,0,0,0.35);
  --shadow-xl: 0 24px 60px rgba(0,0,0,0.7), 0 12px 24px rgba(0,0,0,0.4);
  --inset-highlight: inset 0 1px 0 rgba(255,255,255,0.08);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --bg: #080808;
  --bg-elevated-1: rgba(255,255,255,0.022);
  --bg-elevated-2: rgba(255,255,255,0.028);
  --bg-elevated-3: rgba(255,255,255,0.035);
}
```

Accent injected per-page via `<main style={{ '--accent': business.primary_colour }}>`. Components reference `var(--accent)`.

### Critical visual moves to preserve

1. Hero ambient motion (heroBreath, heroDrift, vignettePulse) kicking in 2.4s after load. Wrap in prefers-reduced-motion.
2. Film grain SVG overlay at 4.5% opacity, fixed, z-index 60.
3. Stats bar: thin Fraunces 300 numbers, tiny mono labels.
4. Type weight rhythm: section h2 Fraunces 300, hero 400, service names 400, prices 400.
5. Eyebrow horizontal mark, 28px hairline via CSS pseudo.
6. Trust pills: Geist Mono uppercase, dot prefix in accent.
7. Section transitions via tonal `--bg-elevated-N` shifts, no hard borders.
8. CTA hover: lift 2px, brighten 5%, deeper shadow.
9. Service card hover: lift 4px, price scale 1.06x, arrow shift right 4px.
10. Footer reset moment: italic business name (clamp 28-52px) plus tagline above compliance row.

### Images

`next/image` always. Hero only gets `priority`. `sizes` set responsively. `placeholder="blur"` with blurDataURL from media table. `quality={85}`. Blur data is a 10x10 base64 generated post-MVP; fall back to `#080808` 1x1 if missing.

### Custom domains

Vercel rewrites + middleware:

```ts
export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || ''
  const url = req.nextUrl.clone()
  if (host.endsWith('.openbook.ie') || host === 'openbook.ie') return NextResponse.next()
  url.pathname = `/__by_domain${url.pathname}`
  return NextResponse.rewrite(url)
}
```

`app/(public)/__by_domain/page.tsx` reads `host` and looks up by `domain` column. Document the manual Vercel domain config in `docs/onboarding-domain.md`.

---

## Part 5, SEO and metadata

Every page needs:

1. `generateMetadata` with title, description, OG, Twitter, canonical.
2. JSON-LD LocalBusiness schema injected via `<Script id="json-ld" type="application/ld+json">`.
3. Dynamic OG image via `opengraph-image.tsx` with `@vercel/og`.
4. Sitemap entry per live business.
5. `robots.txt` allowing everything except `/api`, `/auth`, `/admin`.

---

## Part 6, Performance targets

LCP under 1.5s on 4G. CLS under 0.1. INP under 200ms. Lighthouse mobile 95+.

- Hero image as `priority` `<Image fill>` with overlay divs for gradient and vignette. Never CSS background images.
- Critical fonts with `display: 'swap'`.
- No client-side data fetching for content. Server-rendered with ISR.
- Film grain SVG inlined once globally.
- Hero ambient animations run on CSS, not JS.
- Scroll-spy nav uses one IntersectionObserver, not one per section.

---

## Part 7, Migration order

1. Build the schema (Supabase migration). Verify RLS with anonymous SELECT.
2. Seed SIMply Golf 365 via `scripts/seed-simply-golf.ts`.
3. Build sections in order:
   - First: HeroPhoto, TrustBar, Footer, StickyNav, StickyBookBar
   - Second: Mission, ServicesTabbed, GalleryMosaic, Contact
   - Third: LocationMobile, SocialProofPress, About
   - Last: ServicesFlat, LocationFixed, SocialProofReviews, HeroTypeLed
4. Wire the orchestrator, spot-check against v9.
5. Wire SEO, JSON-LD, OG image. Run Lighthouse.
6. Wire custom domain middleware. Test via `/etc/hosts`.
7. Deploy to Vercel preview, point `simplygolf365.openbook.ie`, then cut over `simplygolf365.ie`.

### Things to hoist into data during migration

(See Part 9 for the full sauna-pressure-test table.)

---

## Part 8, Do-not list

- No localStorage, sessionStorage, IndexedDB.
- No inline styles in production code. Tailwind or CSS modules.
- No hardcoded business data outside `scripts/seed-*.ts`.
- No new section types or variants without updating schema, renderer map, and DB enum together.
- No client-side data fetching for content.
- No new fonts or design tokens outside the brief.
- No `key={Math.random()}` or array index as key.
- No custom font preloading.
- No animations without prefers-reduced-motion wrapping.
- No cookie banners, popups, chat widgets, or third-party scripts beyond analytics.

---

## Part 9, Decoupling tasks (sauna pressure-test)

| # | Where in v9 | Hardcoded | Becomes |
|---|---|---|---|
| 1 | Lines 1052-1057 | Mission statement text and highlight word | `mission.content.statement` and `mission.content.highlight_word` |
| 2 | Line 1193 | About portrait caption | `about.content.portrait_caption` |
| 3 | Line 1214 | Gallery eyebrow | `gallery_mosaic.content.eyebrow` |
| 4 | Line 1274 | Location h2 "We come to you..." | `location_mobile.content.headline` + `italic_accent_phrase` |
| 5 | Line 1277 | Location subhead | `location_mobile.content.subhead` |
| 6 | Line 1426 | Press headline | `social_proof_press.content.headline` |
| 7 | Lines 459, 1612 | CTA button labels | `business.cta_sticky_label`, `business.cta_final_label` |
| 8 | Hero CTA labels (lines 911, 920) | "Book your event", "Book a lesson" | `hero.content.primary_cta.label`, `hero.content.secondary_cta.label` |
| 9 | Section nav labels | Hardcoded | Derive from `sections` array using each section's `eyebrow` or a dedicated `nav_label` field |
| 10 | "Most popular" tag text | Hardcoded English | `services_tabbed.config.popular_tag_label` (defaults to "Most popular") |

---

## Part 10, Definition of done

1. SIMply Golf 365 renders at `simplygolf365.ie` with feature parity to v9. Side-by-side passes on desktop and mobile. LCP under 1.5s. Lighthouse mobile 95+.
2. Switching a single field in Supabase reflects on the live page within 60 seconds (ISR).
3. A seed script for a hypothetical sauna produces a working page at `embersauna.openbook.ie` with all variant logic firing. No code changes between SIMply Golf and the sauna. Only data.

When all three pass, the foundation is real.

---

## Closing

Sam will personally onboard the first 30 businesses. Target is 2 hours per customer, all configuration, no code. When in doubt, choose the option that makes customer 2 cheaper to ship even if customer 1 takes slightly longer.
