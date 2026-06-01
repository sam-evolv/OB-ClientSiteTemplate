'use client';

import { useEffect, useState } from 'react';
import { FONT_SERIF, FONT_MONO } from '@/lib/ui/fonts';
import type { GalleryItem } from '@/lib/viewModel/businessViewModel';

/**
 * Lightbox — fullscreen overlay for gallery items. Keyboard ← / → / Esc, click
 * backdrop to close. Ported near-verbatim from handoff/reference/chrome.jsx.
 * Video items play inline; image items show contained. Caption in italic
 * Fraunces underneath.
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
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    setIdx(openIndex ?? 0);
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
          maxHeight: '82vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          animation: `lbSlide${direction >= 0 ? 'In' : 'InRev'} 300ms cubic-bezier(0.16, 1, 0.3, 1)`
        }}
      >
        {item.type === 'video' && item.videoUrl ? (
          <video
            src={item.videoUrl}
            poster={item.posterUrl}
            controls
            autoPlay
            playsInline
            style={{ maxWidth: '100%', maxHeight: '72vh', borderRadius: 12, background: '#0c0c0c' }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
            alt={item.alt || ''}
            style={{ maxWidth: '100%', maxHeight: '72vh', objectFit: 'contain', borderRadius: 12 }}
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
        @keyframes lbSlideIn    { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes lbSlideInRev { from { opacity: 0; transform: translateX(-24px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
}
