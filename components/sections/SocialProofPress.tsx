import type { SectionProps } from './types';

export function SocialProofPress({ section }: SectionProps<'social_proof_press'>) {
  const { content } = section;
  return (
    <section
      id="press"
      data-section-type="social_proof_press"
      className="px-5 py-24 sm:py-32 border-b border-white/5"
    >
      <p className="font-mono text-[10px] tracking-[0.22em] uppercase opacity-60 mb-4">
        {content.eyebrow}
      </p>
      <h2 className="font-serif font-light text-4xl sm:text-5xl tracking-tight max-w-[22ch]">
        {content.headline}
      </h2>
      <ul className="mt-8 grid gap-2 max-w-[60ch]">
        {content.press.map((p, i) => (
          <li key={`${section.id}-press-${i}`} className="opacity-85">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] mr-2">
              {p.outlet}
            </span>
            <em className="font-serif font-light italic">{p.title}</em>
            <span className="opacity-55"> ({p.date})</span>
          </li>
        ))}
      </ul>
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] opacity-40">
        TODO: implement social_proof_press
      </p>
    </section>
  );
}
