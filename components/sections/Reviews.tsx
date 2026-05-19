import { z } from 'zod';
import { TestimonialSchema, type BusinessRow, type Testimonial } from '@/lib/schemas/business';

/**
 * Reviews section. Reads business.testimonials (JSONB). Returns null
 * when the column is null or refines empty.
 */
export function Reviews({ business }: { business: BusinessRow }) {
  if (!business.testimonials) return null;
  const parsed = z.array(TestimonialSchema).safeParse(business.testimonials);
  if (!parsed.success || parsed.data.length === 0) return null;
  const reviews: Testimonial[] = parsed.data;
  return (
    <section data-section-type="social_proof_reviews" className="px-5 py-24 border-b border-white/5">
      <p className="opacity-85">{reviews.length} review{reviews.length === 1 ? '' : 's'}.</p>
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] opacity-40">
        TODO: implement social_proof_reviews
      </p>
    </section>
  );
}
