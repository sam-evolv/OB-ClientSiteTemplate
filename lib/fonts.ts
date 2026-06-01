import { Fraunces, Geist, Geist_Mono } from 'next/font/google';

/**
 * Variable-font setup for the template. The CSS variable names match the
 * brief, Part 4: --font-fraunces (serif body, headlines), --font-geist
 * (sans, UI elements), --font-geist-mono (monospaced, labels and stats).
 *
 * Tailwind maps these to font-serif, font-sans, font-mono in
 * tailwind.config.ts.
 */

export const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  // opsz keeps font-optical-sizing: auto working (headlines size correctly);
  // SOFT must be included alongside it — dropping SOFT freezes the opsz
  // variation in next/font and renders body text far too narrow. With both,
  // body text lands within ~3% of the Google-CDN reference (an irreducible
  // self-host-vs-CDN optical-sizing nuance, not a CSS-value difference).
  axes: ['opsz', 'SOFT'],
  // The reference leans on Fraunces italic throughout (hero line 2, mission
  // body, section accents). Self-host both styles so no runtime Google request
  // is needed and italic resolves to the variable face, not a synthetic slant.
  style: ['normal', 'italic'],
  variable: '--font-fraunces'
});

export const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist'
});

export const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono'
});

/**
 * Convenience helper for the <html> className. Composes the three font
 * variable classes in one string.
 */
export const fontClassName = `${fraunces.variable} ${geist.variable} ${geistMono.variable}`;
