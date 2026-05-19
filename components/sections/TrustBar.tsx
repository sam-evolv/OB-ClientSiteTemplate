import type { SectionProps } from './types';

export function TrustBar({ section }: SectionProps<'trust_bar'>) {
  const { content } = section;
  return (
    <section
      data-section-type="trust_bar"
      className="px-5 py-10 border-b border-white/5"
    >
      <ul className="flex flex-wrap gap-2.5">
        {content.pills.map((pill, i) => (
          <li
            key={`${section.id}-pill-${i}`}
            className="font-mono text-[11px] tracking-[0.08em] uppercase opacity-80 border border-white/10 rounded-full px-3 py-1.5 inline-flex items-center gap-2"
          >
            <span
              aria-hidden
              className="inline-block w-1 h-1 rounded-full"
              style={{ background: 'var(--accent)' }}
            />
            {pill.label}
          </li>
        ))}
      </ul>
      <p className="mt-6 font-mono text-xs uppercase tracking-[0.18em] opacity-40">
        TODO: implement trust_bar
      </p>
    </section>
  );
}
