import type { BusinessRow } from '@/lib/schemas/business';

/**
 * About section. Returns null when the business has no about_long copy.
 * Uses website_about_headline if provided, otherwise a sensible default.
 */
export function About({ business }: { business: BusinessRow }) {
  if (!business.about_long) return null;
  const headline = business.website_about_headline ?? 'About';
  return (
    <section id="about" data-section-type="about" className="px-5 py-24 border-b border-white/5">
      <h2 className="font-serif font-light text-3xl sm:text-4xl tracking-tight max-w-[18ch]">
        {headline}
      </h2>
      <p className="mt-6 max-w-[58ch] opacity-85 leading-relaxed">{business.about_long}</p>
      {business.founder_name ? (
        <p className="mt-6 opacity-65">
          <strong className="font-normal">{business.founder_name}</strong>
        </p>
      ) : null}
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] opacity-40">
        TODO: implement about
      </p>
    </section>
  );
}
