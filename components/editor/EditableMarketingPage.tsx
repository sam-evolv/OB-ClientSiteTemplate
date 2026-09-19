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
import { EditableSection } from './EditableSection';
import type { CSSProperties } from 'react';
import type { BusinessVM } from '@/lib/viewModel/businessViewModel';

/**
 * The tenant's website, in edit mode.
 *
 * This is a deliberate parallel of MarketingPage rather than a modified copy of
 * it: the public page stays untouched, so the editing layer can never change
 * what a visitor sees. Section order, visibility gates and the accent are
 * identical, so what the owner edits is exactly what is live.
 */
export function EditableMarketingPage({
  b,
  onEdit,
}: {
  b: BusinessVM;
  onEdit: (id: string, label: string) => void;
}) {
  const scrolled = useScrolledPast(500);
  const accent = b.primary_colour;

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
    contact: Boolean(b.phone || b.email),
  };

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

  const wrap = (id: string, label: string, node: React.ReactNode) => (
    <EditableSection id={id} label={label} onEdit={onEdit}>
      {node}
    </EditableSection>
  );

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
          fontVariantNumeric: 'lining-nums',
        } as CSSProperties
      }
    >
      <ScrollProgress accent={accent} />
      <StickyNav visible={scrolled} business={b} sections={activeSections} accent={accent} />
      <StickyBookBar visible={scrolled} accent={accent} />

      {wrap('hero', 'hero', <Hero b={b} accent={accent} variant={b.hero_variant} />)}

      {show.stats && <StatsBar b={b} accent={accent} />}
      {show.mission && <Mission b={b} accent={accent} />}
      {show.events && wrap('services', 'services', <Events b={b} accent={accent} />)}
      {show.included && <Amenities b={b} accent={accent} />}
      {show.about && wrap('about', 'about', <About b={b} accent={accent} />)}
      {show.gallery && wrap('gallery', 'gallery', <Gallery b={b} accent={accent} />)}
      {show.travel && <WhereWeGo b={b} accent={accent} />}
      {show.location && wrap('location', 'address & hours', <LocationHours b={b} accent={accent} />)}
      {show.faq && <Faq b={b} accent={accent} />}
      {show.press && <Press b={b} accent={accent} />}
      {show.contact && wrap('contact', 'contact', <Contact b={b} accent={accent} />)}

      <Footer b={b} accent={accent} />
    </main>
  );
}
