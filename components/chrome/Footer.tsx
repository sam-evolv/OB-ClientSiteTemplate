import type { BusinessRow } from '@/lib/schemas/business';

/**
 * Footer reset moment plus compliance row. Real implementation lands
 * in the next visual session.
 */
export function Footer({ business }: { business: BusinessRow }) {
  return (
    <footer data-chrome="footer" className="px-5 py-16 border-t border-white/5">
      <p className="font-mono text-xs uppercase tracking-[0.18em] opacity-40">
        TODO: implement footer for {business.name}
      </p>
    </footer>
  );
}
