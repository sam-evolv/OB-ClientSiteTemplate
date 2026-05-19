import { z } from 'zod';
import { PressMentionSchema, type BusinessRow, type PressMention } from '@/lib/schemas/business';

/**
 * Press section. Reads business.press_mentions (JSONB). Returns null
 * when the column is null or refines empty.
 */
export function Press({ business }: { business: BusinessRow }) {
  if (!business.press_mentions) return null;
  const parsed = z.array(PressMentionSchema).safeParse(business.press_mentions);
  if (!parsed.success || parsed.data.length === 0) return null;
  const mentions: PressMention[] = parsed.data;
  return (
    <section id="press" data-section-type="social_proof_press" className="px-5 py-24 border-b border-white/5">
      <p className="opacity-85">{mentions.length} press mention{mentions.length === 1 ? '' : 's'}.</p>
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] opacity-40">
        TODO: implement social_proof_press
      </p>
    </section>
  );
}
