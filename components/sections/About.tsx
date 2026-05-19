import type { SectionProps } from './types';

export function About({ section }: SectionProps<'about'>) {
  const { content } = section;
  return (
    <section
      id="about"
      data-section-type="about"
      className="px-5 py-24 sm:py-32 border-b border-white/5"
    >
      <p className="font-mono text-[10px] tracking-[0.22em] uppercase opacity-60 mb-4">
        {content.eyebrow}
      </p>
      <h2 className="font-serif font-light text-4xl sm:text-5xl tracking-tight max-w-[18ch]">
        {content.headline}
      </h2>
      <p className="mt-6 max-w-[58ch] opacity-85 leading-relaxed">{content.body}</p>
      <p className="mt-6 max-w-[58ch] opacity-65">
        <strong className="font-normal">{content.founder.name}</strong>, {content.founder.role}.
      </p>
      {content.portrait_caption ? (
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] opacity-55">
          {content.portrait_caption}
        </p>
      ) : null}
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] opacity-40">
        TODO: implement about
      </p>
    </section>
  );
}
