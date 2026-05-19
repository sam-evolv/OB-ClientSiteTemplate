import { z } from 'zod';
import { TrustSignalSchema, type BusinessRow, type TrustSignal } from '@/lib/schemas/business';

/**
 * Trust pills. Reads business.trust_signals (JSONB). Returns null when
 * the column is null, empty, or fails to refine.
 */
export function TrustBar({ business }: { business: BusinessRow }) {
  if (!business.trust_signals) return null;
  const parsed = z.array(TrustSignalSchema).safeParse(business.trust_signals);
  if (!parsed.success || parsed.data.length === 0) return null;
  const signals: TrustSignal[] = parsed.data;
  return (
    <section data-section-type="trust_bar" className="px-5 py-8 border-b border-white/5">
      <ul className="flex flex-wrap gap-2">
        {signals.map((s, i) => (
          <li
            key={`trust-${i}`}
            className="font-mono text-[11px] uppercase tracking-[0.08em] opacity-80 border border-white/10 rounded-full px-3 py-1.5"
          >
            {s.label}
          </li>
        ))}
      </ul>
      <p className="mt-6 font-mono text-xs uppercase tracking-[0.18em] opacity-40">
        TODO: implement trust_bar
      </p>
    </section>
  );
}
