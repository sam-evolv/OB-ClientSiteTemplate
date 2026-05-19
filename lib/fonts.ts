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
  axes: ['opsz', 'SOFT'],
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
