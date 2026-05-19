import type { BusinessForMarketing } from '@/lib/schemas/business';
import { Hero } from '@/components/sections/Hero';
import { TrustBar } from '@/components/sections/TrustBar';
import { Mission } from '@/components/sections/Mission';
import { Services } from '@/components/sections/Services';
import { Gallery } from '@/components/sections/Gallery';
import { Location } from '@/components/sections/Location';
import { About } from '@/components/sections/About';
import { Press } from '@/components/sections/Press';
import { Reviews } from '@/components/sections/Reviews';
import { Contact } from '@/components/sections/Contact';
import { StickyNav } from '@/components/chrome/StickyNav';
import { StickyBookBar } from '@/components/chrome/StickyBookBar';
import { Footer } from '@/components/chrome/Footer';
import { FilmGrain } from '@/components/chrome/FilmGrain';
import { mapNamedColourToHex } from '@/lib/utils/colour';

/**
 * MarketingPage. Fixed-order render of every section. Each section
 * component decides whether it renders or returns null based on the
 * business row.
 *
 * The page does not know what sections exist or in what order. Adding
 * a section type means adding an import and one JSX line here, plus
 * the component file.
 *
 * The accent CSS variable is injected per-page on the root <main>.
 * primary_colour on businesses is a named colour from a constrained
 * enum (pearl, gold, violet, etc.); mapNamedColourToHex returns the
 * hex for use in CSS.
 */
export function MarketingPage({ data }: { data: BusinessForMarketing }) {
  const { business, services, hours, media } = data;
  const accent = mapNamedColourToHex(business.primary_colour);

  return (
    <main
      className="business-site film-grain min-h-screen bg-[var(--bg)] text-white font-serif"
      style={{ ['--accent' as string]: accent } as React.CSSProperties}
    >
      <FilmGrain />
      <StickyNav business={business} />
      <Hero business={business} />
      <TrustBar business={business} />
      <Mission business={business} />
      <Services business={business} services={services} />
      <Gallery business={business} media={media} />
      <Location business={business} hours={hours} />
      <About business={business} />
      <Press business={business} />
      <Reviews business={business} />
      <Contact business={business} />
      <StickyBookBar business={business} />
      <Footer business={business} />
    </main>
  );
}
