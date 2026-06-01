'use client';

/**
 * Hooks ported near-verbatim from handoff/reference/chrome.jsx.
 * These do not change per business. Behaviour, thresholds, easings and
 * durations are identical to the reference.
 */

import { useEffect, useRef, useState } from 'react';

/**
 * Reveal-on-scroll. Gates a section's opacity/transform until it enters the
 * viewport. Reduced-motion shows everything immediately.
 */
export function useReveal(threshold = 0.12): [React.RefObject<HTMLElement | null>, boolean] {
  const ref = useRef<HTMLElement | null>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setV(true);
      return;
    }
    const o = new IntersectionObserver(
      (entries) =>
        entries.forEach((x) => {
          if (x.isIntersecting) {
            setV(true);
            o.disconnect();
          }
        }),
      { threshold, rootMargin: '0px 0px -6% 0px' }
    );
    o.observe(ref.current);
    return () => o.disconnect();
  }, [threshold]);
  return [ref, v];
}

/** True once the page has scrolled past `px` pixels. Drives the sticky chrome. */
export function useScrolledPast(px = 500): boolean {
  const [s, setS] = useState(false);
  useEffect(() => {
    const onS = () => setS(window.scrollY > px);
    onS();
    window.addEventListener('scroll', onS, { passive: true });
    return () => window.removeEventListener('scroll', onS);
  }, [px]);
  return s;
}

/** Scroll-spy. Returns the id of the section currently in the reading band. */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) setActive(id);
          }),
        { threshold: 0.3, rootMargin: '-30% 0px -40% 0px' }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o && o.disconnect());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(',')]);
  return active;
}

/**
 * Count-up. Animates a number from 0 → target when `active` flips true.
 * Respects reduced-motion (snaps straight to target). easeOutCubic, 1400ms.
 */
export function useCountUp(target: number, active: boolean, duration = 1400): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVal(target);
      return;
    }
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return val;
}
