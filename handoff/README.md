# Handoff: SIMply Golf 365 customer marketing site

> For Claude Code, working in **`sam-evolv/OB-ClientSiteTemplate`**.
> Goal: ship `simplygolf365.openbook.ie` (and `simplygolf365.ie`) so it matches the design reference **pixel for pixel**.

---

## 0. The one-line summary

The design reference in `reference/` is **already a clean React build with the content separated from the components.** Your job is not to invent anything. It is to:

1. Lift the components (`chrome.jsx`, `sections.jsx`, `styles.css`) into the template's production component layer near-verbatim.
2. Move the content out of `data.jsx` into the `businesses` row + related tables in Supabase.
3. Replace the `window.__resources` / inline media with `next/image` + Supabase Storage URLs.

If you find yourself redesigning something, stop — the design is locked. Match the reference.

---

## 1. About the design files

The files in `reference/` are a **design reference built in HTML + Babel-transpiled React**, run as a static artifact. They are *not* the production app and are not meant to ship as-is. They are the single source of truth for **how the site looks and behaves**.

Recreate them inside the existing `OB-ClientSiteTemplate` environment (Next.js 15 App Router, React 19, Tailwind, Supabase, per the canonical brief). Use the template's established patterns — `next/font`, `next/image`, server components, the existing token setup in `globals.css`. Where the reference uses inline `<style>` and `style={{}}` objects, translate to the template's Tailwind + CSS-variable approach, **but do not change any values** (colours, sizes, durations, easings) in the process.

**Fidelity: high (hifi).** This is a pixel-perfect reference. Final colours, type, spacing, motion, and interactions are all intentional and validated. Reproduce them exactly.

---

## 2. The architecture you're plugging into (recap from the canonical brief)

- **One row per business** in the existing `businesses` table + three related tables (`services`, `business_media`, `business_hours`). No `sections` table. No per-business code.
- Variant logic lives **inside each section component** (e.g. Location checks for a fixed address vs travel zones).
- The marketing site reads with anonymous Supabase, filtered by `website_is_published` + `is_live`.
- Render order is **locked** and identical for every business; sections that have no data simply do not render.

SIMply Golf 365 is **customer 1** and the canonical reference for the whole system. Build it so that customer 2 is a data swap, not a code change.

---

## 3. File-by-file: what each reference file becomes

| Reference file | What it is | Where it goes in the template |
|---|---|---|
| `reference/data.jsx` | All business content, one object. **The swappable layer.** | Becomes the Supabase `businesses` row + `services` + `business_media` rows. See §5 for the column map. Nothing here is "code" — it is data. |
| `reference/styles.css` | Locked design tokens, ambient motion keyframes, film grain, hover vocabulary, responsive rules. | Port into the template's global stylesheet / Tailwind layer. Keep every value. See §7. |
| `reference/chrome.jsx` | Hooks + chrome: `useReveal`, `useScrolledPast`, `useActiveSection`, `useCountUp`, `ScrollProgress`, `StickyNav`, `StickyBookBar`, `OpenBookBadge`, `BusinessImage`, `BusinessVideo`, `Lightbox`. | Production React components. Lift near-verbatim; swap `<img>`/background-image for `next/image` where it makes sense (keep the hero as a real `<video>` + poster). |
| `reference/sections.jsx` | Every section component in locked order: `Hero` (3 variants), `StatsBar`, `Mission`, `Events` (+ `ServiceGroups`, `ServiceCard`), `About`, `Gallery`, `WhereWeGo`, `Press`, `Contact`, `Footer`. | Production React components, one file each or grouped — your call, but keep the component boundaries. |
| `reference/app.jsx` | Composition + tweak state threading. | Becomes the page orchestrator (`app/[slug]/page.tsx` or the template's existing marketing page). The `tweaks` object becomes **fixed props from the DB**, not live state — see §8. |
| `reference/tweaks.jsx`, `reference/tweaks-panel.jsx` | The in-design Tweaks panel (accent / hero variant / font scale / section visibility / grain). | **Do not ship.** This is a design-exploration tool only. The *chosen* values become DB fields (accent = `primary_colour`, hero variant = a `website_hero_variant` column, etc.). |

---

## 4. Locked section order

```
Hero → StatsBar → Mission → Events (Services) → About → Gallery → WhereWeGo (Location) → Press → Contact → Footer
```

The sticky nav, sticky book bar, scroll-progress line, and film-grain overlay are global chrome that sit outside the section flow. Do not reorder. A section with no data does not render (the page closes up; no placeholders).

---

## 5. Content → database column map

Everything in `reference/data.jsx`. Fields already in the canonical brief's 11 marketing columns are marked ✓; the rest are either pre-existing `businesses` columns or new JSON columns — confirm against the live schema before adding.

### `businesses` row

| `data.jsx` path | Column | Type | Notes |
|---|---|---|---|
| `name` | `name` | text | |
| `slug` | `slug` | text | `simplygolf365` |
| `category` | `category` | text | `golf-simulator` |
| `founded` | `founded_year` | int | 2025 |
| `primary_colour` | `primary_colour` | text | `#F5F5F4` (pearl). Injected as `--accent` on the page root. |
| `tagline` | `tagline` | text ✓ | |
| `hero_headline_1` | `website_hero_headline_1` | text ✓ | "We bring" |
| `hero_headline_2` | `website_hero_headline_2` | text ✓ | "the course to you." — rendered italic + accent |
| `hero_subhead` | `website_hero_subhead` | text ✓ | |
| *(hero variant)* | `website_hero_variant` | text | NEW. `photo` \| `split` \| `type`. SIMply Golf = `photo`. |
| `about.headline` | `website_about_headline` | text ✓ | "Why this exists." |
| `about.body` | `website_about_body` | text | |
| `founder.name` | `founder_name` | text | "Jack Howard" |
| `founder.role` | `founder_role` | text | "PGA Professional · Founder" |
| `founder.bio` | `founder_bio` | text | |
| *(mission copy)* | `mission_statement` | text ✓ | The italic mission paragraph. |
| *(mission highlight)* | `mission_highlight_word` | text ✓ | "Foresight" — the one word rendered in accent. |
| `travel` | `travel_zones` | jsonb ✓ | `{ primary_zone, description, secondary_zone, secondary_description, further }`. Null ⇒ Location renders the fixed-address variant instead. |
| `venue_requirements` | `venue_requirements` | jsonb ✓ | `[{ stat, label }]` |
| `phone` | `phone` | text | |
| `email` | `email` | text ✓ | (the column the brief notes was missing) |
| `instagram` | `instagram` | text | handle |
| `instagram_url` | `instagram_url` | text | full URL |
| `trust_signals` | `trust_signals` | jsonb ✓ | `[{ label }]` — the hero pills |
| `stats` | `website_stats` | jsonb | NEW. `[{ value, prefix?, suffix?, label }]`. Numeric `value`s count up on scroll. |
| `press_mentions` | `press_mentions` | jsonb ✓ | `[{ outlet, title, date }]` |
| `testimonials` | → `reviews` table or `testimonials` jsonb | | `[{ quote, author, role, context }]`. One only ⇒ render the single-quote block, not the full reviews grid. |

### `services` rows (one per service, grouped)

`data.jsx → service_groups[].services[]`. Each service:

| field | column | notes |
|---|---|---|
| `name` | `services.name` | |
| `duration` | `services.duration` | text, e.g. "4 hours" |
| `price` | `services.price_cents` | **store cents** (650 → 65000). `null` ⇒ renders "On enquiry". |
| `description` | `services.description` | |
| `popular` | `services.is_popular` | bool — the "Most popular" decoy tag |
| group title | `services.group_name` | "Events & corporate" / "1-to-1 Coaching" / "Private gatherings" |
| group blurb | `services.group_blurb` | the italic line above the cards (store once per group, or on a `service_groups` lookup) |

Three groups ⇒ Services renders the **tabbed** variant. One group / all-null `group_name` ⇒ flat list. SIMply Golf = tabbed.

### `business_media` rows

`data.jsx → logo, hero_image, about_portrait, gallery[]`.

| media | `kind` | notes |
|---|---|---|
| `logo.png` | `logo` | rendered with `filter: invert(1)` on the dark bg |
| `hero.jpg` + `video-playing.mp4` | `hero` | image is the poster/fallback; **video is the looping muted hero background** |
| `about-portrait.jpg` | `about` | with caption |
| gallery items | `gallery` | `sort_order` 0–4. Items can be `image` or `video` (poster + optional `videoUrl`). |
| `powered-by-openbook.png` | — | **app asset, not business media.** Ships with the template, identical for every customer. |

---

## 6. Section-by-section spec

Read the reference files for exact markup; this is the intent + the things you must not lose.

### Hero (`photo` variant)
- Full-bleed `<video autoplay muted loop playsinline>` (`video-playing.mp4`) over the poster image (`hero.jpg`). Poster is the fallback and the **reduced-motion** view (gate the `<video>` behind a `prefers-reduced-motion: no-preference` check, as the reference does).
- Three layered ambient animations on the photo layer: `heroBreath` (scale 1→1.025, 16s), `heroDrift` (background-position, 60s), `vignettePulse` (8s) — all start at 2400ms so they begin after the entry zoom.
- Entry: photo scales 1.06→1.0 over 2200ms `cubic-bezier(0.16,1,0.3,1)`; eyebrow → headline → subhead → CTAs → trust pills stagger in (200/350/550/750/900ms delays).
- Top utility bar: **standalone round logo at 68px** (no wordmark) on the left; a "Taking 2026 dates" status pill (green pulsing dot) on the right.
- Headline: Fraunces, line 1 normal, line 2 **italic + accent**. Two CTAs: primary "Book your event" (accent fill), secondary "Book a lesson" (glass).
- The other two hero variants (`split`, `type`) exist in the reference and should be ported too — they're selectable per business via `website_hero_variant`.

### StatsBar
- 5 cells, auto-fit grid. Fraunces 300, clamp 40–76px.
- **Numeric values count up from 0** when the bar scrolls into view (`useCountUp`, easeOutCubic, 1400ms). Non-numeric ("PGA", "Foresight") render as-is. Reduced-motion snaps to final.

### Mission
- Centred editorial pause. Logo emblem at 84px, mono eyebrow, big italic Fraunces 300 paragraph. The `mission_highlight_word` renders upright + accent inside the italic. Founder sign-off below a short divider.

### Events (the most important section)
- Header ("What we do" / "Pick your event. *We do the rest.*") then the tabbed `ServiceGroups`.
- Tabs = group names; active tab fills with accent. Below tabs: italic group blurb, then the service card grid.
- `ServiceCard`: duration (mono), name (Fraunces), description, then a footer row with the **price in accent** and an "Enquire →" affordance. The `is_popular` card gets an accent-tinted bg/border and a "Most popular" pill (top-right, overlapping the edge).
- Hover (desktop): card lifts 4px + shadow, price scales 1.06, arrow nudges right.
- Contains a hidden `#coaching` anchor for the nav.

### About
- Two-column (collapses to one). Left: "How it started" eyebrow, headline, body, founder chip (initials avatar + name + role). Right: portrait (`BusinessImage`, 4:5) with a glassy "On location" caption card overlapping the bottom.

### Gallery
- 12-col mosaic tuned for **portrait phone media**: row 1 = feature image (span 7, 16/11) + portrait video (span 5, 9/16); row 2 = three cells (span 4, 4/5). Collapses to span-12 under 800px.
- **Tiles stagger in** on reveal (opacity + 24px rise, 90ms apart).
- Click any tile ⇒ **fullscreen Lightbox**: prev/next arrows, `02 / 05` counter top-left, close top-right, ← / → / Esc keyboard, click-backdrop to close. Video items play inline in the lightbox; image items show contained. Caption underneath in italic Fraunces.

### WhereWeGo (Location — mobile-zones variant)
- "We come to *you*, anywhere in Munster." Three zone cards (Zone 1 accent-tinted, Zones 2/3 neutral) + a venue-requirements card (4 stat/label pairs) with a closing italic line.
- When `travel_zones` is null, render the fixed-address variant instead (address + `business_hours` grid). Not used by SIMply Golf.

### Press
- Centred header, then a grid of press cards (outlet in accent mono, headline in Fraunces, date). Below: a single highlighted testimonial block (only because there's one review; with many, render a reviews grid).

### Contact
- Big accent-gradient card. "Have a date in *mind?*" + three `ContactMethod` cards (Call / Email / Instagram) + a primary CTA "Get a quote in 24 hrs". Methods are real `tel:` / `mailto:` / IG links.

### Footer
- Centred closing composition: big italic `SIMply Golf 365.` + tagline, then a 3-col meta row balanced around a **140px logo** (always-on accent glow, hover spins 360°): OpenBook pill on the left, copyright block (© 2026 / name / "Cork, Ireland") on the right. Stacks centred on mobile, logo on top.
- The **"Powered by OpenBook" pill** (`powered-by-openbook.png`) is the only place the OpenBook gold `#D4AF37` appears. Hairline gold border, transparent fill, soft gold drop-shadow, lifts on hover.

---

## 7. Design tokens (from `reference/styles.css` — do not change values)

**Colour**
- Background `#080808` (off-black). Foreground `#fafafa` at varying opacity (body 82–88%).
- Per-business accent: `--accent` = `primary_colour` (`#F5F5F4` here). The *only* per-business styling injection.
- OpenBook gold `#D4AF37` / `#E8C76B` — footer pill only.
- Elevated surfaces: `rgba(255,255,255,0.018 → 0.035)` graduated.

**Type** (load via `next/font`, self-hosted)
- **Fraunces** (variable, opsz 9–144): all headlines, body prose, editorial/italic voice.
- **Geist** (300–700): UI — buttons, nav, eyebrows.
- **Geist Mono**: metadata, stat labels, dates.
- Hero headline clamp 44–116px / Fraunces 400 / -0.03em. Section headlines clamp 28–64 / Fraunces 300 / -0.025em. Body 15–17px / 1.6–1.7. Stats clamp 40–76 / Fraunces 300 / -0.035em.

**Spacing** — 4-pt scale (4/8/12/16/24/32/40/48/64). Section padding clamp 64–160px vertical, 20–40px horizontal. Content max-width 1400px.

**Radii** — badges/pills 999, cards 12–16, buttons 10–14, modal/contact 18–24.

**Shadows** — `--shadow-sm/md/lg/xl` (soft, dark-tuned, never pure black) + `--inset-highlight`.

**Motion** — durations 150/250/300/350ms; premium easing `cubic-bezier(0.16, 1, 0.3, 1)`; never linear. Everything wrapped in `prefers-reduced-motion: reduce` (the reference disables all animation + smooth scroll under it).

**Grain** — 4.5% opacity SVG fractal-noise overlay, `position: fixed`, `z-index: 60`, `mix-blend-mode: overlay`. Procedural data-URI, zero bytes.

**Hover vocabulary** (every interactive/informational element responds):
- `.cta-primary` lift 2px + brighten + deeper shadow.
- `.cta-secondary` lift + glass brightens.
- `.hover-pill` lift 1px + accent-tinted border.
- `.hover-card` lift 3px + shadow + accent border halo (press, zones, contact).
- `.brand-logo` lift + 8° tilt + scale + accent glow; footer logo spins 360°.
- `.nav-book` lift + accent glow. `.ob-badge` lift + gold glow.

**Global chrome**
- `ScrollProgress`: 2px accent bar, `position: fixed`, top, `z-index: 100`, `scaleX(scrollFraction)` + accent glow.
- Sticky nav `z-index: 90`, sticky book bar `z-index: 80`, lightbox `z-index: 200`.

---

## 8. Behaviour & state

- **Scroll-spy**: `useActiveSection` (IntersectionObserver) drives the active nav link.
- **Sticky reveal**: nav + book bar appear after 500px scroll (`useScrolledPast`).
- **Reveal-on-scroll**: `useReveal` (IntersectionObserver) gates each section's opacity/transform; reduced-motion shows everything immediately.
- **Tweak fields are fixed at render in production.** In the reference they're live (`accent`, `heroVariant`, `fontScale`, section toggles, grain). In production: `accent` ← `primary_colour`; `heroVariant` ← `website_hero_variant`; section visibility ← "does this business have data for that section"; grain ← always on; fontScale ← always 1.0. Do not ship the Tweaks panel.
- **CTAs** scroll to `#events` / `#coaching` / open `mailto:`. In production wire the primary CTAs to the real booking flow (OpenBook booking app) per the booking integration — out of scope for this template, but leave the hooks obvious.

---

## 9. Production engineering checklist (per the canonical brief)

- [ ] `next/font` self-hosting Fraunces + Geist + Geist Mono (no runtime Google requests).
- [ ] `next/image` for all stills with `sizes`, `priority` on hero poster, `quality={85}`, blur placeholders. Hero motion stays a real `<video>`.
- [ ] Media uploaded to Supabase Storage; `business_media` rows point at the CDN URLs.
- [ ] SEO: metadata, JSON-LD `LocalBusiness`, dynamic OG image.
- [ ] Perf targets: LCP < 1.5s, CLS < 0.1, Lighthouse mobile 95+.
- [ ] Custom-domain middleware maps `simplygolf365.ie` → this business via the `domain` column.
- [ ] Accessibility: WCAG 2.1 AA, visible focus rings (2px), 44px touch targets, all inputs labelled, reduced-motion honoured.
- [ ] Flip `website_is_published = true` only after a visual diff against `reference/04-visual-artifact.html` on desktop + mobile passes.

---

## 10. Definition of done

Open the deployed site beside `reference/04-visual-artifact.html` at 1440px and 375px. They should be **indistinguishable** — same type, spacing, colours, hover states, hero video loop, count-up stats, gallery lightbox, scroll-progress line, footer composition, and the single OpenBook gold pill. If anything differs, the reference wins.
