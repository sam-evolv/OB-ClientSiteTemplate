import type { SectionProps } from './types';

export function Mission({ section }: SectionProps<'mission'>) {
  const { content } = section;
  return (
    <section
      id="mission"
      data-section-type="mission"
      className="px-5 py-24 sm:py-32 text-center border-b border-white/5"
    >
      <p className="font-mono text-[10px] tracking-[0.22em] uppercase opacity-60 mb-4">
        Mission
      </p>
      <p className="font-serif italic font-light text-2xl sm:text-3xl leading-relaxed max-w-[58ch] mx-auto">
        {content.statement}
      </p>
      {content.signed_by ? (
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.14em] opacity-55">
          {content.signed_by}
        </p>
      ) : null}
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] opacity-40">
        TODO: implement mission
      </p>
    </section>
  );
}
