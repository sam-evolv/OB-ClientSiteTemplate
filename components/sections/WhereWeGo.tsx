'use client';

import { useReveal } from '@/lib/hooks';
import { FONT_SERIF, FONT_SANS, FONT_MONO } from '@/lib/ui/fonts';
import type { CSSProperties } from 'react';
import type { BusinessVM } from '@/lib/viewModel/businessViewModel';

/**
 * WhereWeGo — the mobile-zones variant of Location. Three zone cards (Zone 1
 * accent-tinted) + a venue-requirements card with a closing italic line. Ported
 * near-verbatim from handoff/reference/sections.jsx.
 *
 * The reference only ships the mobile-zones variant. When travel_zones is null
 * the section simply does not render (the page closes up); the fixed-address
 * variant noted in README §6 is not part of the reference, so it is not invented
 * here — it is a follow-up if a fixed-location business is onboarded.
 */
export function WhereWeGo({ b, accent }: { b: BusinessVM; accent: string }) {
  const [ref, v] = useReveal();
  if (!b.travel) return null;
  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      style={{
        padding: 'clamp(80px, 12vw, 160px) clamp(20px, 4vw, 40px)',
        opacity: v ? 1 : 0,
        transform: v ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 900ms cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ marginBottom: 'clamp(40px, 6vw, 64px)', maxWidth: 800 }}>
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
            Where we go
          </div>
          <h2
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 300,
              fontSize: 'clamp(32px, 5vw, 64px)',
              lineHeight: 1,
              letterSpacing: '-0.03em',
              marginBottom: 16
            }}
          >
            We come to{' '}
            <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.92)' }}>you</span>, anywhere in
            Munster.
          </h2>
          <p style={{ fontSize: 17, opacity: 0.86, lineHeight: 1.65, letterSpacing: '-0.002em' }}>
            The dome packs into a van. We bring everything: screen, projector, mats, clubs if you need them.
            You bring the venue and the guest list.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
            gap: 14
          }}
        >
          <div
            className="hover-card"
            style={
              {
                padding: 32,
                borderRadius: 16,
                background: `${accent}08`,
                border: `1px solid ${accent}30`,
                cursor: 'default',
                '--hover-accent': `${accent}80`
              } as CSSProperties
            }
          >
            <div
              style={{
                fontSize: 11,
                color: accent,
                marginBottom: 16,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontFamily: FONT_MONO,
                fontWeight: 600
              }}
            >
              Zone 1 · No travel fee
            </div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 26, lineHeight: 1.2, marginBottom: 12 }}>
              {b.travel.primary_zone}
            </div>
            <div style={{ fontSize: 15, opacity: 0.86, lineHeight: 1.6 }}>{b.travel.description}</div>
          </div>
          <div
            className="hover-card"
            style={
              {
                padding: 32,
                borderRadius: 16,
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.06)',
                cursor: 'default',
                '--hover-accent': `${accent}50`
              } as CSSProperties
            }
          >
            <div
              style={{
                fontSize: 11,
                opacity: 0.5,
                marginBottom: 16,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontFamily: FONT_MONO
              }}
            >
              Zone 2 · Small supplement
            </div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 26, lineHeight: 1.2, marginBottom: 12 }}>
              {b.travel.secondary_zone}
            </div>
            <div style={{ fontSize: 15, opacity: 0.86, lineHeight: 1.6 }}>
              {b.travel.secondary_description}
            </div>
          </div>
          <div
            className="hover-card"
            style={
              {
                padding: 32,
                borderRadius: 16,
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.06)',
                cursor: 'default',
                '--hover-accent': `${accent}50`
              } as CSSProperties
            }
          >
            <div
              style={{
                fontSize: 11,
                opacity: 0.5,
                marginBottom: 16,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontFamily: FONT_MONO
              }}
            >
              Anywhere else
            </div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 26, lineHeight: 1.2, marginBottom: 12 }}>
              Rest of Ireland
            </div>
            <div style={{ fontSize: 15, opacity: 0.86, lineHeight: 1.6 }}>{b.travel.further}</div>
          </div>
        </div>

        <div
          style={{
            marginTop: 14,
            padding: 32,
            borderRadius: 16,
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.06)'
          }}
        >
          <div
            style={{
              fontSize: 11,
              opacity: 0.5,
              marginBottom: 20,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontFamily: FONT_MONO
            }}
          >
            Venue requirements
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
              gap: 24
            }}
          >
            {b.venue_requirements.map((r, i) => (
              <div key={i}>
                <div
                  style={{
                    fontFamily: FONT_SERIF,
                    fontWeight: 400,
                    fontSize: 24,
                    color: accent,
                    lineHeight: 1.1,
                    marginBottom: 6,
                    letterSpacing: '-0.01em'
                  }}
                >
                  {r.stat}
                </div>
                <div style={{ fontSize: 13, opacity: 0.7 }}>{r.label}</div>
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: 13,
              opacity: 0.55,
              marginTop: 20,
              fontStyle: 'italic',
              fontFamily: FONT_SERIF
            }}
          >
            Not sure if your venue works? Send a photo and we&apos;ll confirm in under 24 hours.
          </div>
        </div>
      </div>
    </section>
  );
}
