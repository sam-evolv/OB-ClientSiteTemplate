'use client';

import { useReveal, useCountUp } from '@/lib/hooks';
import { FONT_SERIF, FONT_MONO } from '@/lib/ui/fonts';
import type { BusinessVM } from '@/lib/viewModel/businessViewModel';

/** Stat value — counts up when numeric, plain render otherwise. */
function StatValue({ value, reveal }: { value: string; reveal: boolean }) {
  const isNumeric = /^\d+$/.test(String(value));
  const target = isNumeric ? parseInt(value, 10) : 0;
  const counted = useCountUp(target, reveal && isNumeric);
  return <>{isNumeric ? counted : value}</>;
}

/**
 * Stats bar — 5 cells, auto-fit grid, Fraunces 300. Numeric values count up
 * from 0 on reveal; non-numeric ("PGA", "Foresight") render as-is. Ported
 * near-verbatim from handoff/reference/sections.jsx.
 */
export function StatsBar({ b }: { b: BusinessVM; accent: string }) {
  const [ref, v] = useReveal();
  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      style={{
        padding: 'clamp(64px, 9vw, 112px) clamp(20px, 4vw, 40px)',
        background: 'rgba(255,255,255,0.025)',
        opacity: v ? 1 : 0,
        transition: 'opacity 800ms ease'
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))',
          gap: 'clamp(28px, 4vw, 56px)',
          alignItems: 'start'
        }}
      >
        {b.stats.map((s, i) => (
          <div key={i} style={{ textAlign: 'left', position: 'relative' }}>
            <div
              style={{
                fontFamily: FONT_SERIF,
                fontWeight: 300,
                fontSize: 'clamp(40px, 5.5vw, 76px)',
                color: '#fafafa',
                lineHeight: 0.95,
                marginBottom: 14,
                letterSpacing: '-0.035em',
                fontVariantNumeric: 'tabular-nums lining-nums'
              }}
            >
              {s.prefix && (
                <span style={{ opacity: 0.45, fontSize: '0.55em', letterSpacing: 0 }}>{s.prefix}</span>
              )}
              <StatValue value={s.value} reveal={v} />
              {s.suffix && (
                <span style={{ opacity: 0.45, fontSize: '0.45em', letterSpacing: 0, fontWeight: 400 }}>
                  {s.suffix}
                </span>
              )}
            </div>
            <div
              style={{
                fontSize: 10,
                opacity: 0.5,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontFamily: FONT_MONO
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
