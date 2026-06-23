'use client';

import { useScrolledPast } from '@/lib/hooks';
import { FONT_SERIF } from '@/lib/ui/fonts';
import { ScrollProgress } from '@/components/chrome/ScrollProgress';
import { StickyNav } from '@/components/chrome/StickyNav';
import { StickyBookBar } from '@/components/chrome/StickyBookBar';
import { Footer } from '@/components/chrome/Footer';
import { Hero } from '@/components/sections/Hero';
import { StatsBar } from '@/components/sections/StatsBar';
import { Mission } from '@/components/sections/Mission';
import { Events } from '@/components/sections/Events';
import { Amenities } from '@/components/sections/Amenities';
import { About } from '@/components/sections/About';
import { Gallery } from '@/components/sections/Gallery';
import { Faq } from '@/components/sections/Faq';
import { WhereWeGo } from '@/components/sections/WhereWeGo';
import { LocationHours } from '@/components/sections/LocationHours';
import { Press } from '@/components/sections/Press';
import { Contact } from '@/components/sections/Contact';
import type { CSSProperties } from 'react';
import type { BusinessVM } from '@/lib/viewModel/businessViewModel';

/**
 * MarketingPage — composes the site in the locked section order and threads the
 * accent through every section. This is the production analogue of
 * handoff/reference/app.jsx: the live `tweaks` object becomes fixed values
 * (accent ← primary_colour, hero variant ← website_hero_variant, grain ← always
 * on, fontScale ← 1.0), and section visibility is "does this business have data
 * for that section" rather than a toggle. The Tweaks panel is not shipped.
 *
 * Locked order (README §4):
 *   Hero → StatsBar → Mission → Events → About → Gallery → WhereWeGo → Press
 *   → Contact → Footer
 * Global chrome (ScrollProgress, StickyNav, StickyBookBar, film grain) sits
 * outside the section flow.
 */
export function MarketingPage({ b }: { b: BusinessVM }) {
  const scrolled = useScrolledPast(500);
  const accent = b.primary_colour;

  // Section is present iff the business has data for it. Mirrors the reference's
  // tweaks.showX gates, driven by data instead of toggles.
  const show = {
    stats: b.stats.length > 0,
    mission: Boolean(b.mission_statement),
    events: b.service_groups.length > 0,
    included: (b.amenities?.length ?? 0) > 0,
    about: Boolean(b.about.body || b.about.headline || b.founder.name),
    gallery: b.gallery.length > 0,
    travel: Boolean(b.travel),
    location: Boolean(b.location?.address),
    faq: (b.faq?.length ?? 0) > 0,
    press: b.press_mentions.length > 0 || b.testimonials.length > 0,
    contact: Boolean(b.phone || b.email)
  };

  // Nav links only point at sections that actually render.
  const activeSections = b.sections.filter((s) => {
    if (s.id === 'mission') return show.mission;
    if (s.id === 'events') return show.events;
    if (s.id === 'coaching') return show.events;
    if (s.id === 'included') return show.included;
    if (s.id === 'about') return show.about;
    if (s.id === 'gallery') return show.gallery;
    if (s.id === 'faq') return show.faq;
    if (s.id === 'press') return show.press;
    if (s.id === 'contact') return show.contact;
    return true;
  });

  return (
    <main
      className="film-grain"
      style={
        {
          '--accent': accent,
          background: '#080808',
          color: '#fafafa',
          fontFamily: FONT_SERIF,
          minHeight: '100vh',
          overflowX: 'hidden',
          fontVariantNumeric: 'lining-nums'
        } as CSSProperties
      }
    >
      <ScrollProgress accent={accent} />
      <StickyNav visible={scrolled} business={b} sections={activeSections} accent={accent} />
      <StickyBookBar visible={scrolled} accent={accent} />

      <Hero b={b} accent={accent} variant={b.hero_variant} />

      {show.stats && <StatsBar b={b} accent={accent} />}
      {show.mission && <Mission b={b} accent={accent} />}
      {show.events && <Events b={b} accent={accent} />}
      {show.included && <Amenities b={b} accent={accent} />}
      {show.about && <About b={b} accent={accent} />}
      {show.gallery && <Gallery b={b} accent={accent} />}
      {show.travel && <WhereWeGo b={b} accent={accent} />}
      {show.location && <LocationHours b={b} accent={accent} />}
      {show.faq && <Faq b={b} accent={accent} />}
      {show.press && <Press b={b} accent={accent} />}
      {show.contact && <Contact b={b} accent={accent} />}

      <Footer b={b} accent={accent} />
    </main>
  );
}
