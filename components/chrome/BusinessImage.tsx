'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FONT_SERIF, FONT_SANS } from '@/lib/ui/fonts';
import type { CSSProperties } from 'react';

/**
 * Image with caption-on-hover + placeholder fallback. Ported from
 * handoff/reference/chrome.jsx. The reference used a plain <img>; here the still
 * is a next/image (fill) per README §1/§9 — same rendered pixels, optimised
 * delivery. Every style value (aspect, filters, hover scale, caption gradient,
 * timings) is preserved exactly.
 */
export function BusinessImage({
  image,
  fallbackLabel,
  accent,
  aspect = '4/3',
  style = {},
  sizes = '(max-width: 800px) 100vw, 50vw'
}: {
  image?: { url?: string; alt?: string; caption?: string } | null;
  fallbackLabel?: string;
  accent: string;
  aspect?: string;
  style?: CSSProperties;
  sizes?: string;
}) {
  const [hover, setHover] = useState(false);

  if (image && image.url) {
    return (
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: 'relative',
          aspectRatio: aspect,
          overflow: 'hidden',
          background: '#0c0c0c',
          ...style
        }}
      >
        <Image
          src={image.url}
          alt={image.alt || ''}
          fill
          sizes={sizes}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'contrast(1.05) saturate(0.95)',
            transform: hover ? 'scale(1.03)' : 'scale(1)',
            transition: 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
        {image.caption && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '24px 16px 14px',
              background: 'linear-gradient(180deg, transparent 0%, rgba(8,8,8,0.92) 100%)',
              fontSize: 13,
              fontFamily: FONT_SANS,
              color: 'rgba(255,255,255,0.95)',
              opacity: hover ? 1 : 0,
              transform: hover ? 'translateY(0)' : 'translateY(8px)',
              transition: 'all 400ms cubic-bezier(0.16, 1, 0.3, 1)',
              pointerEvents: 'none'
            }}
          >
            {image.caption}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        aspectRatio: aspect,
        background: `linear-gradient(135deg, ${accent}10 0%, ${accent}03 100%)`,
        border: `1px solid ${accent}25`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
    >
      <div
        style={{
          fontFamily: FONT_SERIF,
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'clamp(18px, 2vw, 28px)',
          color: accent,
          opacity: 0.55,
          textAlign: 'center',
          padding: 24
        }}
      >
        {fallbackLabel}
      </div>
    </div>
  );
}
