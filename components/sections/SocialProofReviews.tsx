import type { SectionProps } from './types';

export function SocialProofReviews({ section }: SectionProps<'social_proof_reviews'>) {
  const { content } = section;
  if (content.reviews.length === 0) return null;
  return (
    <section
      data-section-type="social_proof_reviews"
      className="px-5 py-24 sm:py-32 border-b border-white/5"
    >
      <p className="font-mono text-[10px] tracking-[0.22em] uppercase opacity-60 mb-4">
        {content.eyebrow}
      </p>
      <h2 className="font-serif font-light text-4xl sm:text-5xl tracking-tight max-w-[22ch]">
        {content.headline}
      </h2>
      <figure className="mt-8 max-w-[60ch]">
        <blockquote className="font-serif italic font-light text-xl sm:text-2xl leading-relaxed">
          “{content.reviews[0].quote}”
        </blockquote>
        <figcaption className="mt-4 font-mono text-xs uppercase tracking-[0.14em] opacity-65">
          {content.reviews[0].author}
          {content.reviews[0].role ? ` · ${content.reviews[0].role}` : ''}
        </figcaption>
      </figure>
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] opacity-40">
        TODO: implement social_proof_reviews
      </p>
    </section>
  );
}
