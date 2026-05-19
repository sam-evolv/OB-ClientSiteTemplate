import type { SectionProps } from './types';

export function Contact({ section, business }: SectionProps<'contact'>) {
  const { content } = section;
  const ctaLabel = business.cta_final_label || content.cta_label;
  return (
    <section
      id="contact"
      data-section-type="contact"
      className="px-5 py-24 sm:py-32 border-b border-white/5"
    >
      <p className="font-mono text-[10px] tracking-[0.22em] uppercase opacity-60 mb-4">
        Contact
      </p>
      <h2 className="font-serif font-light text-4xl sm:text-5xl tracking-tight max-w-[18ch]">
        {content.headline}
      </h2>
      <p className="mt-6 max-w-[58ch] opacity-85">{content.subhead}</p>
      <ul className="mt-8 grid gap-1.5 max-w-[40ch]">
        {content.contact_methods.map((m, i) => (
          <li key={`${section.id}-method-${i}`} className="opacity-85">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] opacity-65 mr-2">
              {m.label}
            </span>
            {m.value}
          </li>
        ))}
      </ul>
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] opacity-65">
        CTA: {ctaLabel}
      </p>
      <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] opacity-40">
        TODO: implement contact
      </p>
    </section>
  );
}
