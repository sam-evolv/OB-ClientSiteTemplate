export function formatPrice(value?: string | number | null) {
  if (value === null || value === undefined || value === '') return 'POA';
  if (typeof value === 'number') {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: value % 1 ? 2 : 0 }).format(value);
  }
  return value.startsWith('€') ? value : value;
}

export function formatDuration(value?: string | number | null) {
  if (value === null || value === undefined || value === '') return '';
  if (typeof value === 'number') return `${value} min`;
  return value;
}

export function titleCase(value: string) {
  return value.replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function firstSentence(markdown?: string | null) {
  if (!markdown) return '';
  const clean = markdown.replace(/[#*_>`]/g, '').replace(/\s+/g, ' ').trim();
  const match = clean.match(/^.*?[.!?](\s|$)/);
  return (match?.[0] || clean).trim();
}

export function mapsUrl(addressParts: Array<string | null | undefined>) {
  const query = addressParts.filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
