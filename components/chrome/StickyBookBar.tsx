'use client';

import { scrollToSection } from '@/lib/utils/scroll';
import { FONT_SANS, FONT_MONO } from '@/lib/ui/fonts';

/**
 * Sticky book bar — bottom thumb-zone, always one tap to enquire. Appears once
 * the hero is scrolled past. Ported near-verbatim from
 * handoff/reference/chrome.jsx.
 */
export function StickyBookBar({ visible, accent }: { visible: boolean; accent: string }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 80,
        padding: 'clamp(12px, 2vw, 16px)',
        transform: visible ? 'translateY(0)' : 'translateY(110%)',
        transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: visible ? 'auto' : 'none'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(8,8,8,0.94)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16,
          padding: 8,
          gap: 12,
          maxWidth: 600,
          margin: '0 auto',
          boxShadow: 'var(--shadow-xl)'
        }}
      >
        <div
          style={{
            flex: 1,
            padding: '4px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            minWidth: 0
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#4ade80',
              boxShadow: '0 0 12px #4ade80',
              flexShrink: 0
            }}
          />
          <div style={{ fontFamily: FONT_SANS, fontSize: 13, color: '#fafafa', lineHeight: 1.3, minWidth: 0 }}>
            <div style={{ fontWeight: 500 }}>Taking bookings</div>
            <div style={{ opacity: 0.55, fontSize: 11, fontFamily: FONT_MONO }}>For 2026 dates</div>
          </div>
        </div>
        <button
          onClick={() => scrollToSection('events')}
          className="cta-primary"
          style={{
            background: accent,
            color: '#080808',
            border: 'none',
            padding: '14px 22px',
            borderRadius: 10,
            fontFamily: FONT_SANS,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '0.02em',
            cursor: 'pointer',
            minHeight: 48,
            minWidth: 110,
            whiteSpace: 'nowrap',
            boxShadow: 'var(--shadow-md), var(--inset-highlight)'
          }}
        >
          Get a quote →
        </button>
      </div>
    </div>
  );
}
