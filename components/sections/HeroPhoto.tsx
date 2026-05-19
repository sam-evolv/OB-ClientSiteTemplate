import type { SectionProps } from './types';

export function HeroPhoto({ section }: SectionProps<'hero_photo'>) {
  const { content } = section;
  return (
    <header
      data-section-type="hero_photo"
      className="relative px-5 py-24 sm:py-32 border-b border-white/5"
    >
      <p className="font-mono text-[10px] tracking-[0.22em] uppercase opacity-60 mb-4">
        Hero, photo led
      </p>
      <h1 className="font-serif font-normal text-5xl sm:text-7xl leading-[0.95] tracking-tight max-w-[14ch]">
        {content.headline_line_1}
        <br />
        <span className="italic font-light text-[var(--accent)]">{content.headline_line_2}</span>
      </h1>
      <p className="mt-6 max-w-[58ch] text-lg opacity-85">{content.subhead}</p>
      <p className="mt-10 font-mono text-xs uppercase tracking-[0.18em] opacity-40">
        TODO: implement hero_photo
      </p>
    </header>
  );
}
