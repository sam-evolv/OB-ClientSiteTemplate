import type { CSSProperties } from 'react';

/**
 * Returns true when the value is a valid 3 or 6 digit hex colour string.
 */
export function isHexColor(value: string | null | undefined): value is string {
  return Boolean(value && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value));
}

/**
 * Normalises a hex string to its 6 character form without the leading hash.
 */
function normaliseHex(hex: string) {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    return clean.split('').map((char) => char + char).join('');
  }
  return clean;
}

/**
 * Converts a hex colour to an rgb object.
 */
function toRgb(hex: string) {
  const normalised = normaliseHex(hex);
  return {
    r: parseInt(normalised.slice(0, 2), 16),
    g: parseInt(normalised.slice(2, 4), 16),
    b: parseInt(normalised.slice(4, 6), 16)
  };
}

function clamp(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

/**
 * Blends a hex source colour toward a target colour by a 0..1 amount, returning an rgb() string.
 */
export function mix(hex: string, target: '#ffffff' | '#000000', amount: number) {
  const source = toRgb(hex);
  const destination = toRgb(target);
  const blend = (from: number, to: number) => clamp(from + (to - from) * amount);
  return `rgb(${blend(source.r, destination.r)}, ${blend(source.g, destination.g)}, ${blend(source.b, destination.b)})`;
}

/**
 * Produces the four CSS custom properties used by the template to express a business accent colour.
 * Falls back to the OpenBook default gold when the input is not a valid hex.
 */
export function getAccentTheme(primaryColour?: string | null): CSSProperties {
  const accent = isHexColor(primaryColour) ? primaryColour : '#D4AF37';
  return {
    '--accent': accent,
    '--accent-soft': mix(accent, '#ffffff', 0.28),
    '--accent-dark': mix(accent, '#000000', 0.34),
    '--accent-wash': `${accent}24`
  } as CSSProperties;
}
