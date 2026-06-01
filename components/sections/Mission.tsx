'use client';

import Image from 'next/image';
import { useReveal } from '@/lib/hooks';
import { FONT_SERIF, FONT_MONO } from '@/lib/ui/fonts';
import type { ReactNode } from 'react';
import type { BusinessVM } from '@/lib/viewModel/businessViewModel';

/**
 * Renders the mission paragraph with the highlight word lifted upright + accent
 * inside the surrounding italic body. The reference hard-coded this; here it is
 * driven by mission_statement + mission_highlight_word (§5), so the visual is
 * identical and the copy is data.
 */
function withHighlight(text: string, word: string, accent: string): ReactNode {
  const idx = word ? text.indexOf(word) : -1;
  if (idx === -1) return text;
  const before = text.slice(0, idx);
  const after = text.slice(idx + word.length);
  return (
    <>
      {before}
      <span style={{ color: accent, fontStyle: 'normal', fontWeight: 400 }}>{word}</span>
      {after}
    </>
  );
}

/**
 * Mission — centred editorial pause. Logo emblem at 84px, mono eyebrow, big
 * italic Fraunces paragraph, founder sign-off below a short divider. Ported
 * near-verbatim from handoff/reference/sections.jsx.
 */
export function Mission({ b, accent }: { b: BusinessVM; accent: string }) {
  const [ref, v] = useReveal();
  return (
    <section
      id="mission"
      ref={ref as React.RefObject<HTMLElement>}
      style={{
        padding: 'clamp(100px, 16vw, 200px) clamp(20px, 4vw, 40px)',
        opacity: v ? 1 : 0,
        transform: v ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 1000ms cubic-bezier(0.16, 1, 0.3, 1)',
        textAlign: 'center',
        scrollMarginTop: 80
      }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div
          style={{
            display: 'inline-flex',
            marginBottom: 40,
            opacity: v ? 1 : 0,
            transform: v ? 'scale(1)' : 'scale(0.9)',
            transition: 'all 1200ms cubic-bezier(0.16, 1, 0.3, 1) 200ms'
          }}
        >
          <Image
            src={b.logo}
            alt={b.name}
            width={84}
            height={84}
            style={{ borderRadius: '50%', filter: 'invert(1)', background: '#080808' }}
          />
        </div>

        <div
          style={{
            fontSize: 12,
            fontFamily: FONT_MONO,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: accent,
            marginBottom: 28,
            fontWeight: 500,
            opacity: v ? 1 : 0,
            transition: 'opacity 800ms ease 350ms'
          }}
        >
          Mission Statement
        </div>

        <p
          style={{
            fontFamily: FONT_SERIF,
            fontWeight: 300,
            fontStyle: 'italic',
            fontSize: 'clamp(22px, 2.6vw, 34px)',
            lineHeight: 1.4,
            letterSpacing: '-0.015em',
            color: 'rgba(250,250,250,0.96)',
            opacity: v ? 1 : 0,
            transform: v ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 1000ms cubic-bezier(0.16, 1, 0.3, 1) 500ms'
          }}
        >
          {'"'}
          {withHighlight(b.mission_statement, b.mission_highlight_word, accent)}
          {'"'}
        </p>

        <div
          style={{
            width: 60,
            height: 1,
            background: `${accent}60`,
            margin: '48px auto 24px',
            opacity: v ? 1 : 0,
            transition: 'opacity 800ms ease 800ms'
          }}
        />

        <div
          style={{
            fontSize: 13,
            fontFamily: FONT_MONO,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            opacity: v ? 0.55 : 0,
            transition: 'opacity 800ms ease 900ms'
          }}
        >
          {b.founder.name} · Founder
        </div>
      </div>
    </section>
  );
}
