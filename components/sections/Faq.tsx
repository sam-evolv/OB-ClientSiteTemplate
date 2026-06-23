'use client';

import { useReveal } from '@/lib/hooks';
import { FONT_SERIF, FONT_SANS } from '@/lib/ui/fonts';
import type { BusinessVM } from '@/lib/viewModel/businessViewModel';

/**
 * FAQ — a simple accordion built on native <details>/<summary> (no client state,
 * works without JS). Driven by the businesses.faq array; gated on that array in
 * MarketingPage, so it stays hidden for tenants with no FAQ.
 */
export function Faq({ b, accent }: { b: BusinessVM; accent: string }) {
  const [ref, v] = useReveal();
  const items = b.faq ?? [];
  if (items.length === 0) return null;

  return (
    <section
      id="faq"
      ref={ref as React.RefObject<HTMLElement>}
      style={{
        padding: 'clamp(80px, 12vw, 160px) clamp(20px, 4vw, 40px)',
        background: 'rgba(255,255,255,0.018)',
        opacity: v ? 1 : 0,
        transform: v ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 900ms cubic-bezier(0.16, 1, 0.3, 1)',
        scrollMarginTop: 80
      }}
    >
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <div style={{ marginBottom: 'clamp(32px, 5vw, 56px)' }}>
          <div
            className="eyebrow-mark"
            style={{
              fontSize: 12,
              color: accent,
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 16,
              fontFamily: FONT_SANS
            }}
          >
            Good to know
          </div>
          <h2
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 300,
              fontSize: 'clamp(32px, 5vw, 56px)',
              lineHeight: 1,
              letterSpacing: '-0.03em'
            }}
          >
            Frequently asked{' '}
            <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.92)' }}>questions.</span>
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((item, i) => (
            <details
              key={i}
              className="faq-item"
              style={{
                background: 'rgba(255,255,255,0.035)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                padding: '4px 20px'
              }}
            >
              <summary
                style={{
                  cursor: 'pointer',
                  listStyle: 'none',
                  padding: '16px 0',
                  fontFamily: FONT_SANS,
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#fafafa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16
                }}
              >
                {item.q}
                <span aria-hidden="true" style={{ color: accent, fontSize: 22, lineHeight: 1, flexShrink: 0 }}>+</span>
              </summary>
              <div
                style={{
                  paddingBottom: 18,
                  fontFamily: FONT_SANS,
                  fontSize: 15,
                  lineHeight: 1.65,
                  color: 'rgba(255,255,255,0.78)',
                  maxWidth: '70ch'
                }}
              >
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      <style>{`
        .faq-item summary::-webkit-details-marker { display: none; }
        .faq-item[open] summary > span[aria-hidden] { transform: rotate(45deg); }
        .faq-item summary > span[aria-hidden] { transition: transform 200ms ease; display: inline-block; }
      `}</style>
    </section>
  );
}
