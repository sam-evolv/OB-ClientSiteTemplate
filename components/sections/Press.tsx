'use client';

import { useReveal } from '@/lib/hooks';
import { FONT_SERIF, FONT_SANS, FONT_MONO } from '@/lib/ui/fonts';
import type { CSSProperties } from 'react';
import type { BusinessVM } from '@/lib/viewModel/businessViewModel';

/**
 * Press — centred header, grid of press cards (outlet in accent mono, headline
 * in Fraunces, date). Below: a single highlighted testimonial block (rendered
 * only because there is one review). Ported near-verbatim from
 * handoff/reference/sections.jsx.
 */
export function Press({ b, accent }: { b: BusinessVM; accent: string }) {
  const [ref, v] = useReveal();
  return (
    <section
      id="press"
      ref={ref as React.RefObject<HTMLElement>}
      style={{
        padding: 'clamp(80px, 12vw, 160px) clamp(20px, 4vw, 40px)',
        background: 'rgba(255,255,255,0.028)',
        opacity: v ? 1 : 0,
        transform: v ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 900ms cubic-bezier(0.16, 1, 0.3, 1)',
        scrollMarginTop: 80
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 5vw, 56px)' }}>
          <div
            className="eyebrow-mark"
            style={{
              fontSize: 12,
              color: accent,
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 16,
              fontFamily: FONT_SANS,
              justifyContent: 'center'
            }}
          >
            In the press
          </div>
          <h2
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 300,
              fontSize: 'clamp(30px, 4.5vw, 56px)',
              lineHeight: 1,
              letterSpacing: '-0.025em',
              maxWidth: '22ch',
              margin: '0 auto'
            }}
          >
            Something Cork hasn&apos;t seen before.
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))',
            gap: 14,
            marginBottom: 40
          }}
        >
          {b.press_mentions.map((p, i) => (
            <div
              key={i}
              className="hover-card"
              style={
                {
                  padding: 28,
                  borderRadius: 12,
                  background: '#0c0c0c',
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  cursor: 'default',
                  '--hover-accent': `${accent}40`
                } as CSSProperties
              }
            >
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: accent,
                  fontWeight: 600
                }}
              >
                {p.outlet}
              </div>
              <div
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: 19,
                  lineHeight: 1.35,
                  letterSpacing: '-0.005em'
                }}
              >
                &quot;{p.title}&quot;
              </div>
              <div
                style={{
                  fontSize: 12,
                  opacity: 0.5,
                  fontFamily: FONT_MONO,
                  letterSpacing: '0.04em',
                  marginTop: 'auto'
                }}
              >
                {p.date}
              </div>
            </div>
          ))}
        </div>

        {b.testimonials && b.testimonials.length > 0 && (
          <div
            style={{
              padding: 'clamp(32px, 4vw, 48px)',
              background: `linear-gradient(135deg, ${accent}10 0%, ${accent}02 100%)`,
              border: `1px solid ${accent}25`,
              borderRadius: 16,
              maxWidth: 900,
              margin: '0 auto',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                fontFamily: FONT_SERIF,
                fontWeight: 300,
                fontStyle: 'italic',
                fontSize: 'clamp(20px, 2.5vw, 30px)',
                lineHeight: 1.4,
                letterSpacing: '-0.01em',
                marginBottom: 24
              }}
            >
              &quot;{b.testimonials[0].quote}&quot;
            </div>
            <div
              style={{
                paddingTop: 16,
                borderTop: '1px solid rgba(255,255,255,0.08)',
                display: 'inline-block'
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 500 }}>— {b.testimonials[0].author}</div>
              <div style={{ fontSize: 12, opacity: 0.6, marginTop: 2 }}>
                {b.testimonials[0].role} · {b.testimonials[0].context}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
