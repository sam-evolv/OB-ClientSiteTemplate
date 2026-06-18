'use client';

import { useReveal } from '@/lib/hooks';
import { BusinessImage } from '@/components/chrome/BusinessImage';
import { FONT_SERIF, FONT_SANS, FONT_MONO } from '@/lib/ui/fonts';
import type { BusinessVM } from '@/lib/viewModel/businessViewModel';

/**
 * About — two-column (collapses to one). Left: eyebrow, headline, body, founder
 * chip (initials avatar + name + role). Right: portrait (4:5) with a glassy "On
 * location" caption card overlapping the bottom. Ported near-verbatim from
 * handoff/reference/sections.jsx.
 */
export function About({ b, accent }: { b: BusinessVM; accent: string }) {
  const [ref, v] = useReveal();
  return (
    <section
      id="about"
      ref={ref as React.RefObject<HTMLElement>}
      style={{
        padding: 'clamp(80px, 12vw, 160px) clamp(20px, 4vw, 40px)',
        opacity: v ? 1 : 0,
        transform: v ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 900ms cubic-bezier(0.16, 1, 0.3, 1)',
        scrollMarginTop: 80
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
          gap: 'clamp(40px, 6vw, 80px)',
          alignItems: 'center'
        }}
      >
        <div>
          <div
            className="eyebrow-mark"
            style={{
              fontSize: 12,
              color: accent,
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 20,
              fontFamily: FONT_SANS
            }}
          >
            How it started
          </div>
          <h2
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 300,
              fontSize: 'clamp(28px, 4vw, 48px)',
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              marginBottom: 32
            }}
          >
            {b.about.headline}
          </h2>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.7,
              opacity: 0.88,
              letterSpacing: '-0.002em',
              marginBottom: 20,
              maxWidth: '60ch'
            }}
          >
            {b.about.body}
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: 20,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              marginTop: 32,
              maxWidth: 480
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: `${accent}20`,
                border: `1px solid ${accent}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontFamily: FONT_SERIF,
                fontSize: 22,
                fontWeight: 400,
                color: accent,
                letterSpacing: '-0.02em'
              }}
            >
              {b.founder.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 500 }}>{b.founder.name}</div>
              <div style={{ fontSize: 13, opacity: 0.65, marginTop: 2, lineHeight: 1.4 }}>
                {b.founder.role}
              </div>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <BusinessImage
            image={b.about_portrait}
            fallbackLabel={`${b.founder.name.split(' ')[0]} on location`}
            accent={accent}
            aspect="4/5"
            style={{ borderRadius: 16 }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 20,
              left: 20,
              right: 20,
              padding: 16,
              background: 'rgba(8,8,8,0.88)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: 10,
              fontSize: 13,
              fontFamily: FONT_MONO,
              letterSpacing: '0.02em',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <div
              style={{
                color: accent,
                marginBottom: 4,
                fontWeight: 500,
                fontSize: 11,
                letterSpacing: '0.16em',
                textTransform: 'uppercase'
              }}
            >
              On location
            </div>
            <div style={{ opacity: 0.85 }}>{b.about_portrait.caption}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
