'use client';

import { useEffect, useRef, useState } from 'react';
import { FONT_SERIF, FONT_MONO } from '@/lib/ui/fonts';
import type { GalleryItem } from '@/lib/viewModel/businessViewModel';

/**
 * Video inside the lightbox. Opens cleanly and reliably starts playing:
 * attempts playback with sound (the click that opened the lightbox is the user
 * gesture), and if the browser blocks autoplay-with-sound it falls back to
 * muted playback so the clip always moves — the user can unmute via the native
 * controls. `playsInline` keeps it inline on iOS instead of going fullscreen.
 */
function LightboxVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    setLoading(true);
    const p = v.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => {
        // Autoplay-with-sound blocked — mute and try again so it still plays.
        v.muted = true;
        v.play().catch(() => {});
      });
    }
  }, [src]);

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        controls
        autoPlay
        playsInline
        preload="auto"
        onLoadedData={() => setLoading(false)}
        onPlaying={() => setLoading(false)}
        style={{
          maxWidth: '100%',
          maxHeight: '78vh',
          width: 'auto',
          height: 'auto',
          borderRadius: 14,
          background: '#0c0c0c',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
          outline: '1px solid rgba(255,255,255,0.08)',
          display: 'block'
        }}
      />
      {loading && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.18)',
            borderTopColor: 'rgba(255,255,255,0.85)',
            animation: 'lbSpin 700ms linear infinite',
            pointerEvents: 'none'
          }}
        />
      )}
    </div>
  );
}

/**
 * Lightbox — fullscreen overlay for gallery items. Keyboard ← / → / Esc, click
 * backdrop to close. Opens with a clean dialog zoom-fade; prev/next slide.
 * Video items play inline (reliable autoplay + native controls); image items
 * show contained. Caption in italic Fraunces underneath.
 */
export function Lightbox({
  items,
  openIndex,
  onClose
}: {
  items: GalleryItem[];
  openIndex: number | null;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(openIndex ?? 0);
  // 0 = freshly opened (zoom-fade); 1 = next; -1 = prev (slide).
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    setIdx(openIndex ?? 0);
    setDirection(0);
  }, [openIndex]);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        setDirection(-1);
        setIdx((i) => (i - 1 + items.length) % items.length);
      }
      if (e.key === 'ArrowRight') {
        setDirection(1);
        setIdx((i) => (i + 1) % items.length);
      }
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [openIndex, onClose, items.length]);

  if (openIndex === null) return null;
  const item = items[idx];

  const next = () => {
    setDirection(1);
    setIdx((i) => (i + 1) % items.length);
  };
  const prev = () => {
    setDirection(-1);
    setIdx((i) => (i - 1 + items.length) % items.length);
  };

  const imgSrc = item.type === 'video' ? item.posterUrl : item.url;
  const anim =
    direction === 0 ? 'lbZoomIn 280ms' : `lbSlide${direction > 0 ? 'In' : 'InRev'} 300ms`;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(8,8,8,0.95)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(16px, 4vw, 48px)',
        animation: 'lbFadeIn 200ms cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Close (top-right) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close"
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 3,
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fafafa',
          fontSize: 20,
          lineHeight: 1
        }}
      >
        ×
      </button>

      {/* Counter (top-left) */}
      <div
        style={{
          position: 'absolute',
          top: 28,
          left: 28,
          zIndex: 3,
          fontFamily: FONT_MONO,
          fontSize: 11,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.6)'
        }}
      >
        {String(idx + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
      </div>

      {/* Prev */}
      {items.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          aria-label="Previous"
          style={{
            position: 'absolute',
            left: 'clamp(8px, 2vw, 24px)',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 3,
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer',
            color: '#fafafa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {/* Next */}
      {items.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          aria-label="Next"
          style={{
            position: 'absolute',
            right: 'clamp(8px, 2vw, 24px)',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 3,
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer',
            color: '#fafafa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {/* Media */}
      <div
        key={idx}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 'min(1100px, 92vw)',
          maxHeight: '86vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          animation: `${anim} cubic-bezier(0.16, 1, 0.3, 1)`
        }}
      >
        {item.type === 'video' && item.videoUrl ? (
          <LightboxVideo src={item.videoUrl} poster={item.posterUrl} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
            alt={item.alt || ''}
            style={{
              maxWidth: '100%',
              maxHeight: '78vh',
              objectFit: 'contain',
              borderRadius: 14,
              boxShadow: '0 30px 80px rgba(0,0,0,0.55)'
            }}
          />
        )}

        {item.caption && (
          <div
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: 'clamp(14px, 1.4vw, 17px)',
              color: 'rgba(255,255,255,0.78)',
              textAlign: 'center',
              maxWidth: '60ch',
              padding: '0 12px'
            }}
          >
            {item.caption}
          </div>
        )}
      </div>

      <style>{`
        @keyframes lbFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lbZoomIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        @keyframes lbSlideIn    { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes lbSlideInRev { from { opacity: 0; transform: translateX(-24px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes lbSpin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
