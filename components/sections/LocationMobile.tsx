import type { SectionProps } from './types';

export function LocationMobile({ section }: SectionProps<'location_mobile'>) {
  const { content } = section;
  return (
    <section
      data-section-type="location_mobile"
      className="px-5 py-24 sm:py-32 border-b border-white/5"
    >
      <p className="font-mono text-[10px] tracking-[0.22em] uppercase opacity-60 mb-4">
        {content.eyebrow}
      </p>
      <h2 className="font-serif font-light text-4xl sm:text-5xl tracking-tight max-w-[20ch]">
        {content.headline}
      </h2>
      <p className="mt-6 max-w-[58ch] opacity-85">{content.subhead}</p>
      <ul className="mt-6 grid gap-2 max-w-[60ch]">
        {content.zones.map((zone, i) => (
          <li key={`${section.id}-zone-${i}`} className="opacity-85">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] opacity-65 mr-2">
              {zone.label}
            </span>
            <strong className="font-serif font-normal">{zone.name}</strong>
            <span className="opacity-75"> — {zone.description}</span>
          </li>
        ))}
      </ul>
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] opacity-40">
        TODO: implement location_mobile
      </p>
    </section>
  );
}
