'use client';

import Image from 'next/image';
import { OpenBookBadge } from './OpenBookBadge';
import { FONT_SERIF, FONT_SANS, FONT_MONO } from '@/lib/ui/fonts';
import type { CSSProperties } from 'react';
import type { BusinessVM } from '@/lib/viewModel/businessViewModel';

/**
 * Footer — centred closing composition. Big italic name + tagline, then a 3-col
 * meta row balanced around the 140px logo (always-on accent glow, hover spins
 * 360°): OpenBook pill left, copyright right. Ported near-verbatim from
 * handoff/reference/sections.jsx.
 */
export function Footer({ b, accent }: { b: BusinessVM; accent: string }) {
  return (
    <footer
      style={{
        padding: 'clamp(80px, 10vw, 140px) clamp(20px, 4vw, 40px) 110px',
        background: 'rgba(255,255,255,0.022)',
        textAlign: 'center'
      }}
    >
      {/* Reset moment — centred name + tagline. Italic, intimate. */}
      <div style={{ maxWidth: 720, margin: '0 auto clamp(48px, 6vw, 72px)' }}>
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontWeight: 300,
            fontStyle: 'italic',
            fontSize: 'clamp(36px, 5.5vw, 64px)',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            marginBottom: 18,
            color: '#fafafa'
          }}
        >
          {b.name}.
        </div>
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(17px, 1.8vw, 22px)',
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: '-0.005em'
          }}
        >
          {b.tagline}
        </div>
      </div>

      {/* Meta row — logo is the literal centre, flanked by OpenBook (left) and
          copyright (right). The logo carries the glow + hover spin. */}
      <div
        className="footer-meta"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: 'clamp(24px, 4vw, 64px)',
          alignItems: 'center'
        }}
      >
        <div className="footer-meta-left" style={{ justifySelf: 'start' }}>
          <OpenBookBadge size="md" />
        </div>

        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-label={`${b.name} — back to top`}
          className="footer-logo"
          style={{ '--logo-glow': `${accent}55`, textDecoration: 'none', justifySelf: 'center' } as CSSProperties}
        >
          <Image src={b.logo} alt={b.name} width={140} height={140} />
        </a>

        <div className="footer-meta-right" style={{ justifySelf: 'end', textAlign: 'right' }}>
          <div
            style={{
              fontFamily: FONT_MONO,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontSize: 10,
              color: 'rgba(255,255,255,0.45)',
              marginBottom: 6
            }}
          >
            © 2026
          </div>
          <div
            style={{
              fontFamily: FONT_SANS,
              fontSize: 13,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.75)',
              letterSpacing: '0.01em'
            }}
          >
            {b.name}
          </div>
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 10,
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.1em',
              marginTop: 6
            }}
          >
            Cork, Ireland
          </div>
          {(b.privacy_url || b.terms_url) && (
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: 12,
                color: 'rgba(255,255,255,0.55)',
                letterSpacing: '0.01em',
                marginTop: 10,
                display: 'inline-flex',
                gap: 8,
                alignItems: 'center'
              }}
            >
              {b.privacy_url && (
                <a
                  href={b.privacy_url}
                  style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)' }}
                >
                  Privacy
                </a>
              )}
              {b.privacy_url && b.terms_url && (
                <span style={{ opacity: 0.4 }}>·</span>
              )}
              {b.terms_url && (
                <a
                  href={b.terms_url}
                  style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)' }}
                >
                  Terms
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .footer-meta {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .footer-meta-left,
          .footer-meta-right {
            justify-self: center !important;
            text-align: center !important;
          }
          /* Reorder: logo first, badge second, copyright third on mobile. */
          .footer-meta > a.footer-logo { order: -1; }
        }
      `}</style>
    </footer>
  );
}
