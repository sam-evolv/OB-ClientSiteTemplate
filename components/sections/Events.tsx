'use client';

import { useState } from 'react';
import { useReveal } from '@/lib/hooks';
import { formatPrice } from '@/lib/viewModel/businessViewModel';
import { FONT_SERIF, FONT_SANS, FONT_MONO } from '@/lib/ui/fonts';
import type { BusinessVM, ServiceGroupVM, ServiceVM } from '@/lib/viewModel/businessViewModel';

/**
 * Service card. Duration (mono), name (Fraunces), description, then a footer row
 * with the price in accent + an "Enquire →" affordance. The popular card gets an
 * accent-tinted bg/border and a "Most popular" pill. Ported near-verbatim.
 */
function ServiceCard({ service, accent }: { service: ServiceVM; accent: string }) {
  const popular = service.popular;
  return (
    <div
      className="service-card"
      style={{
        position: 'relative',
        padding: 24,
        background: popular ? `${accent}0D` : 'rgba(255,255,255,0.035)',
        border: `1px solid ${popular ? `${accent}50` : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 14,
        cursor: 'pointer',
        transition:
          'transform 400ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 400ms cubic-bezier(0.16, 1, 0.3, 1), border-color 400ms ease, background 400ms ease',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 240,
        transformOrigin: 'center bottom',
        willChange: 'transform'
      }}
    >
      {popular && (
        <div
          style={{
            position: 'absolute',
            top: -10,
            right: 20,
            padding: '4px 10px',
            borderRadius: 999,
            background: accent,
            color: '#080808',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          Most popular
        </div>
      )}
      <div
        style={{
          fontSize: 11,
          opacity: 0.55,
          fontFamily: FONT_MONO,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: 12
        }}
      >
        {service.duration}
      </div>
      <div
        style={{
          fontFamily: FONT_SERIF,
          fontWeight: 400,
          fontSize: 22,
          letterSpacing: '-0.01em',
          marginBottom: 8,
          lineHeight: 1.15
        }}
      >
        {service.name}
      </div>
      <div style={{ fontSize: 15, opacity: 0.85, lineHeight: 1.6, flex: 1, marginBottom: 20 }}>
        {service.description}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          paddingTop: 14,
          borderTop: `1px solid ${popular ? `${accent}30` : 'rgba(255,255,255,0.08)'}`
        }}
      >
        <div
          className="service-price"
          style={{
            fontFamily: FONT_SERIF,
            fontWeight: 400,
            fontSize: service.price === null ? 18 : 30,
            color: accent,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums lining-nums',
            transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
            transformOrigin: 'left center'
          }}
        >
          {formatPrice(service.price)}
        </div>
        <div
          className="service-cta"
          style={{
            fontSize: 13,
            color: popular ? accent : 'rgba(255,255,255,0.75)',
            fontWeight: 500,
            transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1), color 200ms ease'
          }}
        >
          Enquire →
        </div>
      </div>
    </div>
  );
}

/** Service groups (tabbed). Tabs = group names; active tab fills with accent. */
function ServiceGroups({ groups, accent }: { groups: ServiceGroupVM[]; accent: string }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: 6,
          marginBottom: 28,
          flexWrap: 'wrap',
          padding: 6,
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.06)',
          width: 'fit-content',
          maxWidth: '100%'
        }}
      >
        {groups.map((g, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              border: 'none',
              background: active === i ? accent : 'transparent',
              color: active === i ? '#080808' : 'rgba(255,255,255,0.7)',
              fontFamily: FONT_SANS,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              letterSpacing: '0.01em',
              transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
              minHeight: 40
            }}
          >
            {g.title}
          </button>
        ))}
      </div>
      <p
        style={{
          fontSize: 17,
          opacity: 0.86,
          marginBottom: 28,
          maxWidth: 600,
          lineHeight: 1.5,
          fontStyle: 'italic',
          fontFamily: FONT_SERIF,
          fontWeight: 300
        }}
      >
        {groups[active].blurb}
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
          gap: 12
        }}
      >
        {groups[active].services.map((s, i) => (
          <ServiceCard key={i} service={s} accent={accent} />
        ))}
      </div>
    </div>
  );
}

/**
 * Events — the most important section. Header then the tabbed ServiceGroups.
 * Contains a hidden #coaching anchor for the nav. Ported near-verbatim from
 * handoff/reference/sections.jsx.
 */
export function Events({ b, accent }: { b: BusinessVM; accent: string }) {
  const [ref, v] = useReveal();
  return (
    <section
      id="events"
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
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ marginBottom: 'clamp(40px, 6vw, 64px)' }}>
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
            What we do
          </div>
          <h2
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 300,
              fontSize: 'clamp(32px, 5vw, 64px)',
              lineHeight: 1,
              letterSpacing: '-0.03em',
              marginBottom: 16,
              maxWidth: '16ch'
            }}
          >
            Pick your event.{' '}
            <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.92)' }}>We do the rest.</span>
          </h2>
          <p style={{ fontSize: 17, opacity: 0.86, maxWidth: 640, lineHeight: 1.65, letterSpacing: '-0.002em' }}>
            All prices include VAT and setup. We arrive 2 hours before, run the day, and pack down after.
            Final invoicing on confirmed numbers.
          </p>
        </div>
        <ServiceGroups groups={b.service_groups} accent={accent} />
      </div>

      {/* Anchor target for the in-nav "Coaching" link. */}
      <div
        id="coaching"
        style={{ position: 'relative', height: 0, visibility: 'hidden' }}
        aria-hidden="true"
      />
    </section>
  );
}
