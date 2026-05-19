import type { SectionProps } from './types';

export function LocationFixed({ section }: SectionProps<'location_fixed'>) {
  const { content } = section;
  return (
    <section
      data-section-type="location_fixed"
      className="px-5 py-24 sm:py-32 border-b border-white/5"
    >
      <p className="font-mono text-[10px] tracking-[0.22em] uppercase opacity-60 mb-4">
        {content.eyebrow}
      </p>
      <h2 className="font-serif font-light text-4xl sm:text-5xl tracking-tight max-w-[20ch]">
        {content.headline}
      </h2>
      <address className="mt-6 not-italic opacity-85">
        {content.address_line_1}
        {content.address_line_2 ? `, ${content.address_line_2}` : ''}, {content.city} {content.eircode}
      </address>
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] opacity-40">
        TODO: implement location_fixed
      </p>
    </section>
  );
}
