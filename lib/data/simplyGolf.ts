import type { BusinessVM, SectionLink } from '@/lib/viewModel/businessViewModel';

/**
 * SIMply Golf 365 — canonical content.
 *
 * A 1:1 mirror of handoff/reference/data.jsx in the BusinessVM shape. This is
 * THE swappable layer and the single source of truth for the seed: scripts/
 * seed-simply-golf.ts maps these values onto the Supabase columns per README §5,
 * and the live site reads them back through toBusinessViewModel().
 *
 * It also backs local development and the visual-diff check: when Supabase is
 * not configured (no env), app/[slug]/page.tsx renders this object directly, so
 * the page is byte-identical to what the seed writes.
 *
 * Media point at /media/* (copied from handoff/media into /public/media). In
 * production these become Supabase Storage CDN URLs on the business_media rows.
 */

const MEDIA = '/media';

export const simplyGolf: BusinessVM = {
  // ── Identity ──────────────────────────────────────────────────────────────
  name: 'SIMply Golf 365',
  slug: 'simplygolf365',
  // Canonical custom domain, matching the live businesses row. Used for JSON-LD
  // url and the canonical/indexability decision (the local/preview host never
  // equals this, so dev stays noindex).
  custom_domain: 'simplygolf365.ie',
  // No GSC token in the bundled fallback. The demo fallback never emits a
  // verification tag anyway (host never matches the custom domain there).
  gsc_verification: null,
  category: 'golf-simulator',
  founded: 2025,

  // ── Brand ─────────────────────────────────────────────────────────────────
  // Pearl by founder request — monochrome warm off-white. Injected as --accent.
  primary_colour: '#F5F5F4',

  // ── Copy ──────────────────────────────────────────────────────────────────
  tagline: 'Corporate golf. Anywhere you want it.',
  hero_headline_1: 'We bring',
  hero_headline_2: 'the course to you.',
  hero_subhead:
    'A 23-foot inflatable dome with a Foresight simulator inside. Built for events, workplaces and private gatherings, anywhere in Munster, rain or shine.',
  hero_variant: 'photo',

  about: {
    headline: 'Why this exists.',
    body: "The idea came over dinner in late 2024. Jack was working in golf at Fota and Old Head, weighing up a move abroad, and didn't want it. He wanted to stay in Irish golf, but bring it somewhere new. So he built it: a 23-foot dome that travels, a screen that doesn't care about the weather, and a way to bring a proper golf experience to corporate events and private bookings across Munster."
  },

  // ── Founder ───────────────────────────────────────────────────────────────
  founder: {
    name: 'Jack Howard',
    role: 'PGA Professional · Founder',
    bio: 'Jack worked at Fota Island and Old Head before launching SIMply Golf 365 with partner Tara Nolan. Recent winner of the Munster PGA Winter Series in Thurles.'
  },

  // ── Mission ───────────────────────────────────────────────────────────────
  // The italic mission paragraph (no outer quotes — the component adds them).
  // mission_highlight_word renders upright + accent inside the italic body.
  mission_statement:
    'Our mission is to make premium golf experiences accessible anywhere, anytime. Using cutting-edge Foresight technology, we bring the excitement of the course to events, workplaces, and private gatherings, rain or shine, season after season. We aim to create memorable, social, and inclusive golf experiences that elevate any occasion.',
  mission_highlight_word: 'Foresight',

  // ── Travel (mobile-zones variant — no fixed address) ──────────────────────
  travel: {
    primary_zone: 'Cork & Munster',
    description: 'Cork city, county and surrounds — no travel fee.',
    secondary_zone: 'Greater Munster',
    secondary_description: 'Limerick, Tipperary, Kerry, Waterford — small travel supplement.',
    further: 'Anywhere in Ireland — quote on enquiry.'
  },

  // Mobile business: no fixed address or opening hours. The LocationHours
  // section is gated on `location`, so it stays hidden for SIMply Golf.
  location: null,
  hours: [],

  venue_requirements: [
    { stat: '8 × 8 m', label: 'Floor space' },
    { stat: '8 m', label: 'Ceiling height' },
    { stat: 'Indoor', label: 'Hall, marquee or warehouse' },
    { stat: 'Standard 13A', label: 'Power supply' }
  ],

  // ── Contact ───────────────────────────────────────────────────────────────
  phone: '087 409 1291',
  email: 'hello@simplygolf365.ie',
  instagram: '@simplygolf365',
  instagram_url: 'https://instagram.com/simplygolf365',

  // ── Media ─────────────────────────────────────────────────────────────────
  logo: `${MEDIA}/logo.png`,
  hero_image: {
    url: `${MEDIA}/hero.jpg`,
    alt: 'Inside the dome — coach and customer at the simulator',
    videoUrl: `${MEDIA}/video-playing.mp4`
  },
  about_portrait: {
    url: `${MEDIA}/about-portrait.jpg`,
    alt: 'Jack Howard with a young customer at a SIMply Golf 365 pop-up',
    caption: 'Jack with a young customer at a recent pop-up event.'
  },

  // Gallery — 5 items. Mosaic tuned for portrait-leaning phone media.
  gallery: [
    {
      type: 'image',
      url: `${MEDIA}/about-portrait.jpg`,
      alt: 'Jack Howard with a young customer at a SIMply Golf 365 pop-up',
      caption: 'Jack with a young customer at a recent pop-up event'
    },
    {
      type: 'video',
      videoUrl: `${MEDIA}/video-playing.mp4`,
      posterUrl: `${MEDIA}/gallery-playing.jpg`,
      label: 'In the dome',
      alt: 'Coach and customer mid-round on the simulator',
      caption: 'Coach and customer mid-round on the simulator'
    },
    {
      type: 'image',
      url: `${MEDIA}/gallery-playing.jpg`,
      alt: 'Mid-swing on the Foresight simulator',
      caption: 'Mid-swing on the Foresight simulator'
    },
    {
      type: 'video',
      videoUrl: `${MEDIA}/video-dome-setup.mp4`,
      posterUrl: `${MEDIA}/gallery-interior.jpg`,
      label: 'Behind the scenes',
      alt: 'Inside the empty dome before guests arrive',
      caption: 'Setup. Two hours from van to first shot.'
    },
    {
      type: 'image',
      url: `${MEDIA}/gallery-interior.jpg`,
      alt: 'Inside the empty dome',
      caption: 'Memorable, social, inclusive — by design'
    }
  ],

  // ── Trust pills (sit under the hero CTA row) ──────────────────────────────
  trust_signals: [
    { label: 'PGA Professional' },
    { label: 'Foresight simulator' },
    { label: 'Munster & beyond' },
    { label: 'Bookable for any event' }
  ],

  // ── Stats bar ─────────────────────────────────────────────────────────────
  stats: [
    { value: 'PGA', label: 'Professional coach' },
    { value: 'Foresight', label: 'Simulator tech' },
    { value: '23', suffix: ' ft', label: 'Inflatable dome' },
    { value: '30', prefix: '≤ ', label: 'Guests per event' },
    { value: '2', suffix: ' hrs', label: 'Full setup time' }
  ],

  // ── Services — three groups; "popular" marks the decoy mid-tier ───────────
  service_groups: [
    {
      id: 'events',
      title: 'Events & corporate',
      blurb: 'Corporate bookings, team days, and full venue takeovers. Private events are quoted on enquiry.',
      services: [
        { name: 'Corporate day rate', duration: '8 hours', price: 1500, description: 'Best for team days and corporate bookings. Private events are quoted on enquiry so the setup time is priced properly.', popular: true },
        { name: 'Christmas Office Party', duration: '4 hours', price: 750, description: 'Seasonal pricing. Mulled wine package optional.', popular: false }
      ]
    },
    {
      id: 'coaching',
      title: '1-to-1 Coaching',
      blurb: 'Pop-up coaching with PGA Professional Jack Howard. Full Foresight swing analysis.',
      services: [
        { name: '60-min Lesson', duration: '60 min', price: 65, description: 'Swing analysis, technical work, video to take home.', popular: false },
        { name: 'Lesson Block × 5', duration: '5 × 60 min', price: 280, description: 'Save €45. Structured progression plan with Foresight data.', popular: true },
        { name: 'Ladies Get Into Golf', duration: '60 min', price: 40, description: 'Introductory session for new and returning women golfers.', popular: false }
      ]
    },
    {
      id: 'private',
      title: 'Private gatherings',
      blurb: 'Birthday, anniversary, fundraiser, or private booking. Custom events are quoted properly on enquiry.',
      services: [
        { name: 'Custom event', duration: 'Bespoke', price: null, description: 'Tell us the brief and we will quote it properly.', popular: false }
      ]
    }
  ],

  // ── Press ─────────────────────────────────────────────────────────────────
  press_mentions: [
    { outlet: 'Echo Live', title: "Cork's newest golf simulator experience", date: 'Nov 2025' },
    { outlet: 'Cork Golf News', title: 'Jack Howard launches Simply Golf 365', date: 'Nov 2025' },
    { outlet: 'Carrigdhoun', title: "Ireland's First Mobile Golf Simulator", date: 'Dec 2025' }
  ],

  // ── Testimonials (one only → single-quote block, not the reviews grid) ─────
  testimonials: [
    {
      quote:
        "Jack ran a half-day for our team — 16 of us, none of us proper golfers. The leaderboard was vicious and the craic was savage. Sorted.",
      author: 'Tech company team lead',
      role: 'Corporate half-day',
      context: 'Cork city, Nov 2025'
    }
  ],

  sections: [] // filled below
};

// Sections — drives nav + scroll-spy. Order is locked (matches data.jsx).
export const SECTIONS: SectionLink[] = [
  { id: 'mission', label: 'Mission' },
  { id: 'events', label: 'Events' },
  { id: 'coaching', label: 'Coaching' },
  { id: 'about', label: 'About' },
  { id: 'gallery', label: 'Inside the dome' },
  { id: 'press', label: 'Press' },
  { id: 'contact', label: 'Contact' }
];

simplyGolf.sections = SECTIONS;
