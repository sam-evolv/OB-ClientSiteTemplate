'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { FONT_SERIF, FONT_MONO } from '@/lib/ui/fonts';
import type { CSSProperties } from 'react';

/** "W/H" → padding-bottom %. See BusinessImage for why we avoid CSS aspect-ratio. */
function aspectPadding(aspect: string): number {
  const [w, h] = aspect.split('/').map((n) => parseFloat(n.trim()));
  if (!w || !h) return 56.25;
  return (h / w) * 100;
}

/**
 * Inline video — poster + play overlay; plays muted/autoplay on tap. Ported from
 * handoff/reference/chrome.jsx. In the gallery the tiles get videoUrl=null so the
 * click bubbles to the parent and opens the Lightbox. Poster is a next/image;
 * the clip stays a real <video>. The media box uses the padding-ratio hack so it
 * renders on iOS/WebKit (see BusinessImage).
 */
export function BusinessVideo({
  video,
  accent,
  aspect = '4/5',
  style = {},
  label,
  sizes = '(max-width: 800px) 100vw, 40vw'
}: {
  video?: { posterUrl?: string; videoUrl?: string | null; alt?: string } | null;
  accent: string;
  aspect?: string;
  style?: CSSProperties;
  label?: string;
  sizes?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (!video || !video.videoUrl) return;
    if (ref.current) {
      ref.current.play();
      setPlaying(true);
    }
  };

  if (!video || (!video.posterUrl && !video.videoUrl)) {
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
        <div style={{ fontFamily: FONT_SERIF, fontStyle: 'italic', color: accent, opacity: 0.55 }}>
          Video coming soon
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handlePlay}
      style={{
        position: 'relative',
        width: '100%',
        height: 0,
        paddingBottom: `${aspectPadding(aspect)}%`,
        overflow: 'hidden',
        background: '#0c0c0c',
        cursor: video.videoUrl ? 'pointer' : 'default',
        ...style
      }}
    >
      {video.videoUrl && playing ? (
        <video
          ref={ref}
          src={video.videoUrl}
          controls
          autoPlay
          playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <>
          <Image
            src={video.posterUrl as string}
            alt={video.alt || ''}
            fill
            sizes={sizes}
            style={{ objectFit: 'cover', filter: 'contrast(1.05) saturate(0.95)' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, transparent 0%, rgba(8,8,8,0.5) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(8,8,8,0.6)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: `2px solid ${accent}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 200ms ease'
              }}
            >
              <svg width="20" height="22" viewBox="0 0 24 24" fill={accent} style={{ marginLeft: 3 }}>
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          {label && (
            <div
              style={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                padding: '6px 12px',
                background: 'rgba(8,8,8,0.78)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 6,
                fontSize: 11,
                fontFamily: FONT_MONO,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: accent,
                fontWeight: 500,
                display: 'inline-block',
                width: 'fit-content'
              }}
            >
              {label}
            </div>
          )}
        </>
      )}
    </div>
  );
}
