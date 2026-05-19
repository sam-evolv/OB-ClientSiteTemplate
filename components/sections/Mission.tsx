import type { BusinessRow } from '@/lib/schemas/business';

/**
 * Mission section. Returns null when the business has no mission_statement.
 * The Foresight-style highlight word is rendered upright inside the
 * italic paragraph by the next visual session.
 */
export function Mission({ business }: { business: BusinessRow }) {
  if (!business.mission_statement) return null;
  return (
    <section id="mission" data-section-type="mission" className="px-5 py-24 border-b border-white/5 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-60 mb-4">
        Mission
      </p>
      <p className="font-serif italic font-light text-2xl sm:text-3xl leading-relaxed max-w-[58ch] mx-auto">
        {business.mission_statement}
      </p>
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] opacity-40">
        TODO: implement mission
      </p>
    </section>
  );
}
