import type { BusinessRow } from '@/lib/schemas/business';

/**
 * Sticky top navigation, scroll-spied. Real implementation lands in the
 * next visual session against reference/simply_golf_v9.jsx.
 */
export function StickyNav({ business }: { business: BusinessRow }) {
  return (
    <nav
      data-chrome="sticky_nav"
      className="px-5 py-4 border-b border-white/5 sticky top-0 z-40 bg-[var(--bg)]"
    >
      <p className="font-mono text-xs uppercase tracking-[0.18em] opacity-40">
        TODO: implement sticky_nav for {business.name}
      </p>
    </nav>
  );
}
