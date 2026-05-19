/**
 * Smoothly scrolls the viewport to the section with the given id,
 * accounting for the sticky nav offset. No-op when invoked server-side
 * or when the target element is not found.
 */
export function scrollToSection(id: string, offset = 80): void {
  if (typeof window === 'undefined') return;
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}
