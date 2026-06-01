/**
 * Font-family strings for inline styles in the ported reference components.
 *
 * The design reference (handoff/reference/*.jsx) writes literal family names
 * in its inline styles: `'Fraunces, Georgia, serif'`, `'Geist, system-ui,
 * sans-serif'`, `'Geist Mono, monospace'`. In the template the same faces are
 * self-hosted with next/font (lib/fonts.ts) and exposed as CSS variables, so
 * the only faithful translation is to swap the literal family name for the
 * matching variable while keeping every fallback identical.
 *
 * This is the one allowed "value" substitution from the handoff (§1: translate
 * to the template's next/font approach), and it is required by §9 (no runtime
 * Google font requests). Nothing else about the type — sizes, weights, line
 * heights, letter-spacing, italics — changes.
 */

export const FONT_SERIF = 'var(--font-fraunces), Georgia, serif';
export const FONT_SANS = 'var(--font-geist), system-ui, sans-serif';
export const FONT_MONO = 'var(--font-geist-mono), ui-monospace, monospace';
