'use client';

import { useEffect, useState } from 'react';

/**
 * Scroll progress — hairline accent bar at the very top of the viewport that
 * fills left→right as the page is read. Ported from handoff/reference/chrome.jsx.
 */
export function ScrollProgress({ accent }: { accent: string }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 100,
        pointerEvents: 'none'
      }}
    >
      <div
        style={{
          height: '100%',
          width: '100%',
          background: accent,
          transformOrigin: 'left center',
          transform: `scaleX(${p})`,
          transition: 'transform 120ms linear',
          boxShadow: `0 0 12px ${accent}80`,
          opacity: p > 0.005 ? 1 : 0
        }}
      />
    </div>
  );
}
