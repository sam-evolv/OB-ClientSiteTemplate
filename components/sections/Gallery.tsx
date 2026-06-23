'use client';

import { useState } from 'react';
import { useReveal } from '@/lib/hooks';
import { BusinessImage } from '@/components/chrome/BusinessImage';
import { BusinessVideo } from '@/components/chrome/BusinessVideo';
import { Lightbox } from '@/components/chrome/Lightbox';
import { FONT_SERIF, FONT_SANS } from '@/lib/ui/fonts';
import type { BusinessVM } from '@/lib/viewModel/businessViewModel';

/**
 * Gallery — 12-col mosaic tuned for portrait phone media. Row 1: feature image
 * (span 7, 16/11) + portrait video (span 5, 9/16). Row 2: three cells (span 4,
 * 4/5). Tiles stagger in on reveal (90ms apart). Click any tile → fullscreen
 * Lightbox. Ported near-verbatim from handoff/reference/sections.jsx.
 */
export function Gallery({ b, accent }: { b: BusinessVM; accent: string }) {
  const [ref, v] = useReveal();
  const [lbIdx, setLbIdx] = useState<number | null>(null);

  const layout = [
    // Feature tile + the narrow portrait slot both bias their crop toward the
    // top of the source image. Portrait subjects (people standing) that land in
    // either container keep their heads in frame instead of getting clipped by
    // a centre crop. The 4/5 tiles are close enough to portrait that a centre
    // crop is fine.
    { col: 'span 7', aspect: '16/11', objectPosition: '50% 22%' }, // 0 — feature image
    { col: 'span 5', aspect: '9/16', objectPosition: '50% 30%' }, // 1 — portrait video
    { col: 'span 4', aspect: '4/5' }, // 2
    { col: 'span 4', aspect: '4/5' }, // 3 — portrait video
    { col: 'span 4', aspect: '4/5' } // 4
  ];

  return (
    <section
      id="gallery"
      ref={ref as React.RefObject<HTMLElement>}
      style={{
        padding: 'clamp(80px, 12vw, 160px) clamp(20px, 4vw, 40px)',
        background: 'rgba(255,255,255,0.022)',
        opacity: v ? 1 : 0,
        transform: v ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 900ms cubic-bezier(0.16, 1, 0.3, 1)',
        scrollMarginTop: 80
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
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
          Inside the dome
        </div>
        <h2
          style={{
            fontFamily: FONT_SERIF,
            fontWeight: 300,
            fontSize: 'clamp(30px, 4.5vw, 56px)',
            lineHeight: 1,
            letterSpacing: '-0.025em',
            marginBottom: 'clamp(36px, 5vw, 56px)'
          }}
        >
          What you{' '}
          <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.92)' }}>actually</span> get on the
          day.
        </h2>

        <div className="gallery-grid">
          {layout.map((g, i) => {
            const item = b.gallery[i];
            if (!item) return null;
            const wrapperStyle = { gridColumn: g.col, cursor: 'pointer' };
            const itemStyle = { borderRadius: 8 };
            return (
              <div
                key={i}
                className={`gallery-item gallery-item-${i}`}
                style={{
                  ...wrapperStyle,
                  opacity: v ? 1 : 0,
                  transform: v ? 'translateY(0)' : 'translateY(24px)',
                  transition: `opacity 700ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 90}ms, transform 700ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 90}ms`
                }}
                onClick={() => setLbIdx(i)}
              >
                {item.type === 'video' ? (
                  <BusinessVideo
                    video={{ ...item, videoUrl: null }} // tile shows poster + play overlay; lightbox plays the real video
                    accent={accent}
                    aspect={g.aspect}
                    label={item.label}
                    style={itemStyle}
                  />
                ) : (
                  <BusinessImage
                    image={item}
                    fallbackLabel="Inside the dome"
                    accent={accent}
                    aspect={g.aspect}
                    style={itemStyle}
                    objectPosition={g.objectPosition}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Lightbox items={b.gallery} openIndex={lbIdx} onClose={() => setLbIdx(null)} />
    </section>
  );
}
