import type { BusinessRow, BusinessMedia } from '@/lib/schemas/business';

/**
 * Gallery mosaic. Returns null when the business has no media rows.
 * Falls back to caption + url placeholder until the next visual session.
 */
export function Gallery({
  business: _business,
  media
}: {
  business: BusinessRow;
  media: BusinessMedia[];
}) {
  if (media.length === 0) return null;
  return (
    <section id="gallery" data-section-type="gallery_mosaic" className="px-5 py-24 border-b border-white/5">
      <p className="opacity-85">{media.length} image{media.length === 1 ? '' : 's'}.</p>
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] opacity-40">
        TODO: implement gallery_mosaic
      </p>
    </section>
  );
}
