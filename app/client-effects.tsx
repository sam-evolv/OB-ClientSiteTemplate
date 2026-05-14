'use client';

import { useEffect, useState } from 'react';

export function ClientEffects({ bookingHref }: { bookingHref: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const hero = document.querySelector<HTMLElement>('[data-hero]');

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
    );

    sections.forEach((section) => revealObserver.observe(section));

    const heroObserver = hero
      ? new IntersectionObserver(
          ([entry]) => setVisible(!entry.isIntersecting),
          { threshold: 0.08 }
        )
      : null;

    if (hero && heroObserver) heroObserver.observe(hero);

    return () => {
      revealObserver.disconnect();
      heroObserver?.disconnect();
    };
  }, []);

  return (
    <a className={`sticky-book ${visible ? 'is-visible' : ''}`} href={bookingHref}>
      Book now
    </a>
  );
}
