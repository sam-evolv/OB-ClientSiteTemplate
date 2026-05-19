import type { SectionProps } from './types';

export function GalleryMosaic({ section }: SectionProps<'gallery_mosaic'>) {
  const { content } = section;
  return (
    <section
      id="gallery"
      data-section-type="gallery_mosaic"
      className="px-5 py-24 sm:py-32 border-b border-white/5"
    >
      <p className="font-mono text-[10px] tracking-[0.22em] uppercase opacity-60 mb-4">
        {content.eyebrow}
      </p>
      <h2 className="font-serif font-light text-4xl sm:text-5xl tracking-tight max-w-[20ch]">
        {content.intro_headline}
      </h2>
      <p className="mt-6 opacity-85">{content.items.length} item(s).</p>
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] opacity-40">
        TODO: implement gallery_mosaic
      </p>
    </section>
  );
}
