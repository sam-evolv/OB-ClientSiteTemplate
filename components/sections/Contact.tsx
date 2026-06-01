'use client';

import { useReveal } from '@/lib/hooks';
import { FONT_SERIF, FONT_SANS, FONT_MONO } from '@/lib/ui/fonts';
import type { CSSProperties } from 'react';
import type { BusinessVM } from '@/lib/viewModel/businessViewModel';

function ContactMethod({
  kind,
  value,
  href,
  accent,
  largeSize
}: {
  kind: 'Call' | 'Email' | 'Instagram';
  value: string;
  href: string;
  accent: string;
  largeSize?: boolean;
}) {
  return (
    <a
      href={href}
      target={kind === 'Instagram' ? '_blank' : undefined}
      rel="noopener"
      className="hover-card"
      style={
        {
          padding: 24,
          borderRadius: 14,
          background: 'rgba(8,8,8,0.4)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          textDecoration: 'none',
          color: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          '--hover-accent': `${accent}80`
        } as CSSProperties
      }
    >
      <div
        style={{
          fontSize: 11,
          opacity: 0.5,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          fontFamily: FONT_MONO
        }}
      >
        {kind}
      </div>
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: largeSize ? 18 : 14,
          color: '#fafafa',
          fontWeight: 500,
          wordBreak: 'break-all'
        }}
      >
        {value}
      </div>
    </a>
  );
}

/**
 * Contact — big accent-gradient card. "Have a date in mind?" + three
 * ContactMethod cards (Call / Email / Instagram) + a primary CTA. Methods are
 * real tel: / mailto: / IG links. Ported near-verbatim from
 * handoff/reference/sections.jsx.
 */
export function Contact({ b, accent }: { b: BusinessVM; accent: string }) {
  const [ref, v] = useReveal();
  return (
    <section
      id="contact"
      ref={ref as React.RefObject<HTMLElement>}
      style={{
        padding: 'clamp(80px, 12vw, 160px) clamp(20px, 4vw, 40px)',
        opacity: v ? 1 : 0,
        transform: v ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 900ms cubic-bezier(0.16, 1, 0.3, 1)',
        scrollMarginTop: 80
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div
          style={{
            padding: 'clamp(48px, 6vw, 80px) clamp(32px, 5vw, 64px)',
            background: `linear-gradient(135deg, ${accent}15 0%, ${accent}05 100%)`,
            border: `1px solid ${accent}30`,
            borderRadius: 24
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2
              style={{
                fontFamily: FONT_SERIF,
                fontWeight: 300,
                fontSize: 'clamp(32px, 5vw, 64px)',
                lineHeight: 1,
                letterSpacing: '-0.03em',
                maxWidth: '20ch',
                margin: '0 auto 16px'
              }}
            >
              Have a date in{' '}
              <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.92)' }}>mind?</span>
            </h2>
            <p style={{ fontSize: 17, opacity: 0.86, lineHeight: 1.5, maxWidth: 540, margin: '0 auto' }}>
              Tell us when and where. We&apos;ll come back within 24 hours with availability and a quote.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
              gap: 14,
              marginBottom: 32
            }}
          >
            <ContactMethod
              kind="Call"
              value={b.phone}
              href={`tel:${b.phone.replace(/\s/g, '')}`}
              accent={accent}
              largeSize
            />
            <ContactMethod kind="Email" value={b.email} href={`mailto:${b.email}`} accent={accent} />
            <ContactMethod
              kind="Instagram"
              value={b.instagram}
              href={b.instagram_url || '#'}
              accent={accent}
              largeSize
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              className="cta-primary"
              onClick={() => {
                window.location.href = `mailto:${b.email}`;
              }}
              style={{
                background: accent,
                color: '#080808',
                border: 'none',
                padding: '18px 36px',
                borderRadius: 12,
                fontFamily: FONT_SANS,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                minHeight: 56,
                boxShadow: 'var(--shadow-lg), var(--inset-highlight)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10
              }}
            >
              Get a quote in 24 hrs →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
