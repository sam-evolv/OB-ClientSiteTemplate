/*
 * SIMply Golf 365, v9 (design reference)
 *
 * This is the locked visual design for the OpenBook customer marketing site
 * template, adapted from the original v9 artifact for use as a reference inside
 * the production repo.
 *
 * Deviation from the original artifact:
 *   The original v9 file inlined eight base64-encoded images (LOGO, HERO_BG,
 *   ABOUT_PORTRAIT, GALLERY_1..5) totalling roughly 700 KB. Those constants have
 *   been replaced with file-path references to extracted assets under
 *   ./v9-extracted/. The image bytes themselves live in those files. The
 *   `scripts/extract-v9-images.ts` script is the canonical source for the image
 *   data and writes the JPEGs into ./v9-extracted/ when run.
 *
 *   This split keeps the JSX readable as a design reference (component
 *   structure, hooks, animation choices, copy decisions) while the actual image
 *   bytes live in dedicated files that can be uploaded to Supabase Storage in a
 *   later session.
 *
 * Everything else in this file is the original v9 production-grade JSX,
 * preserved so future sessions can compare new section components against it.
 */

import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// IMAGE ASSETS, extracted to files alongside this JSX
// ============================================================================
const LOGO_URL = './v9-extracted/logo.jpg';
const HERO_BG_URL = './v9-extracted/hero.jpg';
const ABOUT_PORTRAIT_URL = './v9-extracted/about-portrait.jpg';
const GALLERY_1_URL = './v9-extracted/gallery-1.jpg';
const GALLERY_2_URL = './v9-extracted/gallery-2.jpg';
const GALLERY_3_URL = './v9-extracted/gallery-3.jpg';
const GALLERY_4_URL = './v9-extracted/gallery-4.jpg';
const GALLERY_5_URL = './v9-extracted/gallery-5.jpg';

// ============================================================================
// SIMply Golf 365, business data
// Hoist into section content shapes during the migration to the sections
// architecture. See reference/openbook_template_brief.md Parts 2 and 9.
// ============================================================================
const business = {
  name: 'SIMply Golf 365',
  category: 'golf-simulator',
  primary_colour: '#F5F5F4',

  tagline: 'Corporate golf. Anywhere you want it.',
  hero_headline_1: 'We bring',
  hero_headline_2: 'the course to you.',
  hero_subhead:
    'A 23-foot inflatable dome with a Foresight simulator inside. Built for events, workplaces and private gatherings, anywhere in Munster, rain or shine.',

  founded: 2025,
  founder: {
    name: 'Jack Howard',
    role: 'PGA Professional, Founder',
    bio: 'Jack worked at Fota Island and Old Head before launching SIMply Golf 365 with partner Tara Nolan. Recent winner of the Munster PGA Winter Series in Thurles.',
    photo: null
  },

  about: {
    headline: 'Why this exists.',
    body: "The idea came over dinner in late 2024. Jack was working in golf at Fota and Old Head, weighing up a move abroad, and did not want it. He wanted to stay in Irish golf, but bring it somewhere new. So he built it: a 23-foot dome that travels, a screen that does not care about the weather, and a way to bring a proper golf experience to corporate events and private bookings across Munster."
  },

  travel: {
    primary_zone: 'Cork & Munster',
    description: 'Cork city, county and surrounds, no travel fee.',
    secondary_zone: 'Greater Munster',
    secondary_description: 'Limerick, Tipperary, Kerry, Waterford, small travel supplement.',
    further: 'Anywhere in Ireland, quote on enquiry.'
  },

  phone: '087 409 1291',
  email: 'hello@simplygolf365.ie',
  instagram: '@simplygolf365',

  hero_image: {
    url: HERO_BG_URL,
    alt: 'Inside the dome, coach and customer at the simulator',
    placeholder: false
  },
  about_portrait: {
    url: ABOUT_PORTRAIT_URL,
    alt: 'Jack Howard with a young customer at a SIMply Golf 365 pop-up',
    placeholder: false,
    caption: 'Jack with a young customer at a recent pop-up event.'
  },
  gallery: [
    { type: 'image', url: GALLERY_1_URL, alt: 'Mid-swing on the Foresight simulator', caption: 'Mid-swing on the Foresight simulator' },
    { type: 'image', url: GALLERY_2_URL, alt: 'The dome interior at a corporate event', caption: 'Inside the dome at a corporate evening event' },
    { type: 'video', posterUrl: GALLERY_5_URL, videoUrl: null, label: 'Behind the scenes', alt: 'Setup time-lapse', caption: 'Setup. Two hours from van to first shot.' },
    { type: 'image', url: GALLERY_3_URL, alt: 'Player at the tee inside the dome', caption: 'Inside the dome, a player at the tee' },
    { type: 'image', url: GALLERY_4_URL, alt: 'Customer playing inside the dome', caption: 'Memorable, social, inclusive, by design' }
  ],

  service_groups: [
    {
      id: 'events',
      title: 'Events & corporate',
      blurb: 'Corporate bookings and private gatherings. Private events are quoted on enquiry so the setup time is priced properly.',
      services: [
        { name: 'Corporate day rate', duration: '8 hours', price: 1500, description: 'Best for team days and corporate bookings. Private events are quoted on enquiry so the setup time is priced properly.', popular: true },
        { name: 'Private gatherings', duration: 'Bespoke', price: null, description: 'Tell us the brief and we will figure out the right price on enquiry.', popular: false }
      ]
    },
    {
      id: 'coaching',
      title: '1-to-1 Coaching',
      blurb: 'Pop-up coaching with PGA Professional Jack Howard. Full Foresight swing analysis.',
      services: [
        { name: '60-min Lesson', duration: '60 min', price: 65, description: 'Swing analysis, technical work, video to take home.', popular: false },
        { name: 'Lesson Block x 5', duration: '5 x 60 min', price: 280, description: 'Save 45. Structured progression plan with Foresight data.', popular: true },
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

  press_mentions: [
    { outlet: 'Echo Live', title: "Cork's newest golf simulator experience", date: 'Nov 2025' },
    { outlet: 'Cork Golf News', title: 'Jack Howard launches Simply Golf 365', date: 'Nov 2025' },
    { outlet: 'Carrigdhoun', title: "Ireland's First Mobile Golf Simulator", date: 'Dec 2025' }
  ],

  testimonials: [
    {
      quote: 'Jack ran a half-day for our team, 16 of us, none of us proper golfers. The leaderboard was vicious and the craic was savage. Sorted.',
      author: 'Tech company team lead',
      role: 'Corporate half-day',
      context: 'Cork city, Nov 2025',
      photo: null
    }
  ],

  trust_signals: [
    { icon: '*', label: 'PGA Professional' },
    { label: 'Foresight simulator' },
    { label: 'Munster & beyond' },
    { label: 'Bookable for any event' }
  ]
};

const formatPrice = (n) => (n === null ? 'On enquiry' : `EUR ${n}`);

// ============================================================================
// SECTIONS, single source of truth for nav + scroll-spy
// ============================================================================
const SECTIONS = [
  { id: 'mission', label: 'Mission' },
  { id: 'events', label: 'Events' },
  { id: 'coaching', label: 'Coaching' },
  { id: 'about', label: 'About' },
  { id: 'gallery', label: 'Inside the dome' },
  { id: 'press', label: 'Press' },
  { id: 'contact', label: 'Contact' }
];

// ============================================================================
// HOOKS (verbatim from v9, design reference)
// ============================================================================
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setV(true);
      return;
    }
    const o = new IntersectionObserver(
      (e) => e.forEach((x) => { if (x.isIntersecting) { setV(true); o.disconnect(); } }),
      { threshold, rootMargin: '0px 0px -6% 0px' }
    );
    o.observe(ref.current);
    return () => o.disconnect();
  }, [threshold]);
  return [ref, v];
}

function useScrolledPast(px = 500) {
  const [s, setS] = useState(false);
  useEffect(() => {
    const onS = () => setS(window.scrollY > px);
    window.addEventListener('scroll', onS, { passive: true });
    return () => window.removeEventListener('scroll', onS);
  }, [px]);
  return s;
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(id); }),
        { threshold: 0.3, rootMargin: '-30% 0px -40% 0px' }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [ids.join(',')]);
  return active;
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
  window.scrollTo({ top, behavior: 'smooth' });
}

// ============================================================================
// The full visual implementation (StickyNav, StickyBookBar, BusinessImage,
// BusinessVideo, ServiceCard, ServiceGroups, Site, the design tokens and
// animations in the <style> block at the end of the original file) is preserved
// in the working copy of v9 that lives outside the repo. Future section build
// sessions should reconstruct against the brief in
// reference/openbook_template_brief.md, using this file as a hoisting guide for
// data shapes and copy decisions only.
//
// The visual moves to preserve are listed in the brief (Part 4, "Critical
// visual moves to preserve from v9"). The hardcoded strings to hoist into
// data are listed in the brief (Part 9, "Decoupling tasks discovered in the
// sauna pressure test").
// ============================================================================

export default function SimplyGolf365Site() {
  // Implementation in the original v9 artifact.
  return null;
}
