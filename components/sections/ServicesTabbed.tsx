import type { SectionProps } from './types';

export function ServicesTabbed({ section }: SectionProps<'services_tabbed'>) {
  const { content } = section;
  return (
    <section
      id="events"
      data-section-type="services_tabbed"
      className="px-5 py-24 sm:py-32 border-b border-white/5"
    >
      <p className="font-mono text-[10px] tracking-[0.22em] uppercase opacity-60 mb-4">
        Services, tabbed
      </p>
      <h2 className="font-serif font-light text-4xl sm:text-5xl tracking-tight max-w-[16ch]">
        {content.intro_headline}
      </h2>
      {content.intro_subhead ? (
        <p className="mt-4 max-w-[58ch] opacity-85">{content.intro_subhead}</p>
      ) : null}
      <ul className="mt-8 flex flex-wrap gap-3">
        {content.groups.map((group) => (
          <li
            key={group.id}
            className="font-mono text-[11px] uppercase tracking-[0.1em] border border-white/10 rounded px-3 py-1.5 opacity-80"
          >
            {group.title} ({group.services.length})
          </li>
        ))}
      </ul>
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] opacity-40">
        TODO: implement services_tabbed
      </p>
    </section>
  );
}
