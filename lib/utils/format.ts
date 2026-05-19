/**
 * Formats a price for display. Numbers render as Euro with smart decimal handling.
 * Strings pass through unchanged. Null, undefined or empty values render as "POA".
 */
export function formatPrice(value?: string | number | null): string {
  if (value === null || value === undefined || value === '') return 'POA';
  if (typeof value === 'number') {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: value % 1 ? 2 : 0
    }).format(value);
  }
  return value;
}

/**
 * Builds a Google Maps directions URL from an address parts array.
 * Filters falsy parts and URL-encodes the joined query.
 */
export function mapsUrl(addressParts: Array<string | null | undefined>): string {
  const query = addressParts.filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
