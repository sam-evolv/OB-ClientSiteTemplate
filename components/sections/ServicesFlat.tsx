import type { SectionProps } from './types';

export function ServicesFlat({ section }: SectionProps<'services_flat'>) {
  const { content } = section;
  return (
    <section
      data-section-type="services_flat"
      className="px-5 py-24 sm:py-32 border-b border-white/5"
    >
      <p className="font-mono text-[10px] tracking-[0.22em] uppercase opacity-60 mb-4">
        Services, flat
      </p>
      <h2 className="font-serif font-light text-4xl sm:text-5xl tracking-tight max-w-[16ch]">
        {content.intro_headline}
      </h2>
      <p className="mt-6 opacity-85">{content.services.length} service(s) listed.</p>
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] opacity-40">
        TODO: implement services_flat
      </p>
    </section>
  );
}
