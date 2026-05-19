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

/**
 * Maps a named colour from the businesses.primary_colour CHECK constraint
 * to a hex value used in CSS variable injection. Returns the value unchanged
 * if it already looks like a hex. Falls back to the OpenBook default gold
 * when the value is unknown or null.
 *
 * Source of truth for the named-colour list is the CHECK constraint
 * `businesses_primary_colour_check` in the public.businesses table.
 */
const NAMED_COLOURS: Record<string, string> = {
  gold: '#D4AF37',
  amber: '#F59E0B',
  ember: '#EA580C',
  crimson: '#DC2626',
  rose: '#F43F5E',
  orchid: '#C026D3',
  violet: '#8B5CF6',
  indigo: '#6366F1',
  azure: '#0EA5E9',
  teal: '#14B8A6',
  emerald: '#10B981',
  fern: '#65A30D',
  bronze: '#B45309',
  walnut: '#78350F',
  terracotta: '#C2410C',
  sage: '#84A98C',
  eucalyptus: '#6B7F69',
  stone: '#A8A29E',
  onyx: '#1C1917',
  graphite: '#3F3F46',
  slate: '#475569',
  linen: '#F5F0E8',
  pearl: '#F5F5F4',
  cream: '#FEF3C7'
};

export function mapNamedColourToHex(value: string | null | undefined): string {
  if (!value) return NAMED_COLOURS.gold;
  if (isHexColor(value)) return value;
  return NAMED_COLOURS[value] ?? NAMED_COLOURS.gold;
}
