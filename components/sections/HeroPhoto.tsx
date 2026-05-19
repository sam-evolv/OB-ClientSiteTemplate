import type { BusinessRow } from '@/lib/schemas/business';

/**
 * Hero variant for businesses with a hero image. Internal to Hero.tsx,
 * the dispatch component decides when to render this.
 *
 * The placeholder reflects the data this variant needs and the data
 * the next visual session will wire into the actual layout. The h1
 * concatenates the two headline lines so the page has meaningful
 * text content during the placeholder phase.
 */
export function HeroPhoto({ business }: { business: BusinessRow }) {
  const line1 = business.website_hero_headline_1 ?? business.name;
  const line2 = business.website_hero_headline_2;
  const subhead = business.website_hero_subhead ?? business.tagline;
  return (
    <header data-section-type="hero_photo" className="px-5 py-24 border-b border-white/5">
      <h1 className="font-serif font-normal text-4xl sm:text-6xl leading-tight">
        {line1}
        {line2 ? (
          <>
            <br />
            <span className="italic font-light text-[var(--accent)]">{line2}</span>
          </>
        ) : null}
      </h1>
      {subhead ? <p className="mt-6 max-w-[58ch] opacity-85">{subhead}</p> : null}
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] opacity-40">
        TODO: implement hero_photo
      </p>
    </header>
  );
}
