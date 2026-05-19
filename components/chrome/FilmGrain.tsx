/**
 * Global film grain overlay. Fixed across the viewport at z-index 60.
 * The visual rule lives in app/globals.css (.film-grain::after). This
 * component is currently a no-op placeholder; the .film-grain class
 * sits on the MarketingPage <main> root and that is what triggers the
 * pseudo-element. Kept as a separate component so the next session
 * has a single insertion point if the grain needs DOM controls
 * (intensity toggle, reduced-motion variant) later.
 */
export function FilmGrain() {
  return null;
}
