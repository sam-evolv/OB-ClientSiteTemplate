import type { BusinessRow } from '@/lib/schemas/business';

/**
 * Sticky bottom CTA bar. Visible after the hero scrolls out. The
 * label reads from business.cta_sticky_label once that field is on
 * the schema; for now this is a placeholder. Real implementation
 * lands in the next visual session.
 */
export function StickyBookBar({ business: _business }: { business: BusinessRow }) {
  return (
    <div
      data-chrome="sticky_book_bar"
      className="fixed bottom-0 left-0 right-0 px-5 py-3 border-t border-white/5 bg-[var(--bg)] z-40"
    >
      <p className="font-mono text-xs uppercase tracking-[0.18em] opacity-40">
        TODO: implement sticky_book_bar
      </p>
    </div>
  );
}
