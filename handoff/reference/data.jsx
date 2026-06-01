// ============================================================================
// SIMply Golf 365 — Business data
// THE SWAPPABLE LAYER.
// To onboard a new business: copy this file, replace values, swap media URLs.
// Every field maps 1:1 to a column in the Supabase `businesses` (plus
// `services`, `business_media`) tables. In production the renderer reads from
// Supabase; here we read from this object directly.
// ============================================================================

const MEDIA = './media';

const business = {
  // ── Identity ──────────────────────────────────────────────────────────────
  name: 'SIMply Golf 365',
  slug: 'simplygolf365',
  category: 'golf-simulator',
  founded: 2025,

  // ── Brand ─────────────────────────────────────────────────────────────────
  // primary_colour: any from OpenBook's 24-colour palette. Pearl by founder
  // request — monochrome warm off-white. The Tweak panel exposes alternatives.
  primary_colour: '#F5F5F4',

  // ── Copy ──────────────────────────────────────────────────────────────────
  tagline: 'Golf. Anywhere you want it.',
  hero_headline_1: 'We bring',
  hero_headline_2: 'the course to you.',
  hero_subhead:
    'A 25-foot inflatable dome with a Foresight simulator inside. Built for events, workplaces and private gatherings, anywhere in Munster, rain or shine.',

  about: {
    headline: 'Why this exists.',
    body:
      "The idea came over dinner in late 2024. Jack was working in golf at Fota and Old Head, weighing up a move abroad, and didn't want it. He wanted to stay in Irish golf, but bring it somewhere new. So he built it: a dome that travels, a screen that doesn't care about the weather, a way for the people who'd never set foot on a course to have a brilliant evening playing one.",
  },

  // ── Founder ───────────────────────────────────────────────────────────────
  founder: {
    name: 'Jack Howard',
    role: 'PGA Professional · Founder',
    bio:
      'Jack worked at Fota Island and Old Head before launching SIMply Golf 365 with partner Tara Nolan. Recent winner of the Munster PGA Winter Series in Thurles.',
  },

  // ── Travel (mobile-zones variant — no fixed address) ──────────────────────
  travel: {
    primary_zone: 'Cork & Munster',
    description: 'Cork city, county and surrounds — no travel fee.',
    secondary_zone: 'Greater Munster',
    secondary_description:
      'Limerick, Tipperary, Kerry, Waterford — small travel supplement.',
    further: 'Anywhere in Ireland — quote on enquiry.',
  },

  venue_requirements: [
    { stat: '8 × 8 m', label: 'Floor space' },
    { stat: '8 m', label: 'Ceiling height' },
    { stat: 'Indoor', label: 'Hall, marquee or warehouse' },
    { stat: 'Standard 13A', label: 'Power supply' },
  ],

  // ── Contact ───────────────────────────────────────────────────────────────
  phone: '087 409 1291',
  email: 'hello@simplygolf365.ie',
  instagram: '@simplygolf365',
  instagram_url: 'https://instagram.com/simplygolf365',

  // Media
  logo: `${MEDIA}/logo.png`,
  hero_image: {
    url: `${MEDIA}/hero.jpg`,
    alt: 'Inside the dome — coach and customer at the simulator',
    // Optional: hero plays this as a muted, autoplaying, looping background
    // video. Image above is the fallback (and what reduced-motion users see).
    videoUrl: `${MEDIA}/video-playing.mp4`,
  },
  about_portrait: {
    url: `${MEDIA}/about-portrait.jpg`,
    alt: 'Jack Howard with a young customer at a SIMply Golf 365 pop-up',
    caption: 'Jack with a young customer at a recent pop-up event.',
  },

  // Gallery — 5 items. The mosaic in sections.jsx is tuned for portrait-leaning
  // phone media (which is what we have). Row 1: Jack + a vertical reel.
  // Row 2: three 4:5 cells.
  //
  // type: 'image' or 'video'. Video items have posterUrl + optional videoUrl.
  // Drop additional video files into ./media and reference them here — the
  // BusinessVideo component handles the play overlay / inline playback.
  gallery: [
    {
      type: 'image',
      url: `${MEDIA}/about-portrait.jpg`,
      alt: 'Jack Howard with a young customer at a SIMply Golf 365 pop-up',
      caption: 'Jack with a young customer at a recent pop-up event',
    },
    {
      type: 'video',
      videoUrl: `${MEDIA}/video-playing.mp4`,
      posterUrl: `${MEDIA}/gallery-playing.jpg`,
      label: 'In the dome',
      alt: 'Coach and customer mid-round on the simulator',
      caption: 'Coach and customer mid-round on the simulator',
    },
    {
      type: 'image',
      url: `${MEDIA}/gallery-playing.jpg`,
      alt: 'Mid-swing on the Foresight simulator',
      caption: 'Mid-swing on the Foresight simulator',
    },
    {
      type: 'video',
      videoUrl: `${MEDIA}/video-dome-setup.mp4`,
      posterUrl: `${MEDIA}/gallery-interior.jpg`,
      label: 'Behind the scenes',
      alt: 'Inside the empty dome before guests arrive',
      caption: 'Setup. Two hours from van to first shot.',
    },
    {
      type: 'image',
      url: `${MEDIA}/gallery-interior.jpg`,
      alt: 'Inside the empty dome',
      caption: 'Memorable, social, inclusive — by design',
    },
  ],

  // ── Trust pills (sit under the hero CTA row) ──────────────────────────────
  trust_signals: [
    { label: 'PGA Professional' },
    { label: 'Foresight simulator' },
    { label: 'Munster & beyond' },
    { label: 'Bookable for any event' },
  ],

  // ── Stats bar ─────────────────────────────────────────────────────────────
  stats: [
    { value: 'PGA',       label: 'Professional coach' },
    { value: 'Foresight', label: 'Simulator tech' },
    { value: '25', suffix: ' ft', label: 'Inflatable dome' },
    { value: '30', prefix: '≤ ',  label: 'Guests per event' },
    { value: '2',  suffix: ' hrs', label: 'Full setup time' },
  ],

  // ── Services — three groups; "popular" marks the decoy mid-tier ───────────
  service_groups: [
    {
      id: 'events',
      title: 'Events & corporate',
      blurb:
        'We bring the dome to your venue and run the day. Up to 30 guests.',
      services: [
        { name: 'Half-Day Corporate',     duration: '4 hours',  price:  650, description: 'Up to 20 guests. Closest-to-pin, longest-drive, team leaderboard.',                  popular: false },
        { name: 'Full-Day Corporate',     duration: '8 hours',  price: 1200, description: 'Team-building format. Format brief, leaderboards, prizes, branded scorecards.',     popular: true  },
        { name: 'Stag / Hen Package',     duration: '3 hours',  price:  450, description: 'Group of 10 to 12. Food and drinks tie-ins available.',                              popular: false },
        { name: 'Christmas Office Party', duration: '4 hours',  price:  750, description: 'Seasonal pricing. Mulled wine package optional.',                                   popular: false },
      ],
    },
    {
      id: 'coaching',
      title: '1-to-1 Coaching',
      blurb:
        'Pop-up coaching with PGA Professional Jack Howard. Full Foresight swing analysis.',
      services: [
        { name: '60-min Lesson',         duration: '60 min',     price:  65, description: 'Swing analysis, technical work, video to take home.',                  popular: false },
        { name: 'Lesson Block × 5',      duration: '5 × 60 min', price: 280, description: 'Save €45. Structured progression plan with Foresight data.',          popular: true  },
        { name: 'Ladies Get Into Golf',  duration: '60 min',     price:  40, description: 'Introductory session for new and returning women golfers.',           popular: false },
      ],
    },
    {
      id: 'private',
      title: 'Private gatherings',
      blurb:
        "Birthday, anniversary, fundraiser, or just a few mates. Smaller groups, your venue.",
      services: [
        { name: 'Group of 4',  duration: '2 hours', price: 220,  description: 'Compact setup. Suits home garages and small venues.', popular: false },
        { name: 'Group of 8',  duration: '3 hours', price: 380,  description: 'The popular size. Full dome experience.',             popular: true  },
        { name: 'Custom event', duration: 'Bespoke', price: null, description: "Tell us what you need. We'll quote.",                 popular: false },
      ],
    },
  ],

  // ── Press ─────────────────────────────────────────────────────────────────
  press_mentions: [
    { outlet: 'Echo Live',       title: "Cork's newest golf simulator experience", date: 'Nov 2025' },
    { outlet: 'Cork Golf News',  title: 'Jack Howard launches Simply Golf 365',    date: 'Nov 2025' },
    { outlet: 'Carrigdhoun',     title: "Ireland's First Mobile Golf Simulator",   date: 'Dec 2025' },
  ],

  // ── Testimonials (empty array → section omits cleanly) ────────────────────
  testimonials: [
    {
      quote:
        "Jack ran a half-day for our team — 16 of us, none of us proper golfers. The leaderboard was vicious and the craic was savage. Sorted.",
      author: 'Tech company team lead',
      role: 'Corporate half-day',
      context: 'Cork city, Nov 2025',
    },
  ],
};

// Sections — drives nav + scroll-spy. Order is locked.
const SECTIONS = [
  { id: 'mission',  label: 'Mission' },
  { id: 'events',   label: 'Events' },
  { id: 'coaching', label: 'Coaching' },
  { id: 'about',    label: 'About' },
  { id: 'gallery',  label: 'Inside the dome' },
  { id: 'press',    label: 'Press' },
  { id: 'contact',  label: 'Contact' },
];

const formatPrice = (n) => (n === null ? 'On enquiry' : `€${n}`);

// Expose for the other (non-bundled) script tags.
Object.assign(window, { business, SECTIONS, formatPrice });
