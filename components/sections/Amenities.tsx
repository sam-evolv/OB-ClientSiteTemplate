'use client';

import { useReveal } from '@/lib/hooks';
import { FONT_SERIF, FONT_SANS } from '@/lib/ui/fonts';
import type { CSSProperties } from 'react';
import type { BusinessVM } from '@/lib/viewModel/businessViewModel';

/**
 * Amenities — the "What's included" perks grid for membership-style tenants.
 * Driven entirely by the businesses.amenities array; the section is gated on
 * that array having entries in MarketingPage, so it stays hidden for tenants
 * (like SIMply Golf) that have no amenities.
 */
export function Amenities({ b, accent }: { b: BusinessVM; accent: string }) {
  const [ref, v] = useReveal();
  const items = b.amenities ?? [];
  if (items.length === 0) return null;

  return (
    <section
      id="included"
      ref={ref as React.RefObject<HTMLElement>}
      style={{
        padding: 'clamp(80px, 12vw, 160px) clamp(20px, 4vw, 40px)',
        opacity: v ? 1 : 0,
        transform: v ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 900ms cubic-bezier(0.16, 1, 0.3, 1)',
        scrollMarginTop: 80
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
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
            Your membership
          </div>
          <h2
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 300,
              fontSize: 'clamp(32px, 5vw, 56px)',
              lineHeight: 1,
              letterSpacing: '-0.03em',
              maxWidth: '18ch'
            }}
          >
            What&apos;s <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.92)' }}>included.</span>
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))',
            gap: 12
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              style={
                {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '18px 20px',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.035)',
                  border: '1px solid rgba(255,255,255,0.08)'
                } as CSSProperties
              }
            >
              <span
                aria-hidden="true"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: `${accent}1A`,
                  border: `1px solid ${accent}55`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <span style={{ fontFamily: FONT_SANS, fontSize: 15, fontWeight: 500, color: '#fafafa', lineHeight: 1.35 }}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
