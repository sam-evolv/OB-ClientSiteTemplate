import type { BusinessVM } from '@/lib/viewModel/businessViewModel';

export interface EditableSectionRef {
  id: string;
  label: string;
}

/**
 * The sections this site actually has something to edit.
 *
 * Presence must mirror the render gates in MarketingPage / EditableMarketingPage
 * exactly — offering the owner an "Edit gallery" control for a section their site
 * does not render is worse than offering nothing.
 */
export function editableSectionsFor(b: BusinessVM): EditableSectionRef[] {
  const present: Array<[boolean, EditableSectionRef]> = [
    [true, { id: 'hero', label: 'Hero' }],
    [b.service_groups.length > 0, { id: 'services', label: 'Services & pricing' }],
    [
      Boolean(b.about.body || b.about.headline || b.founder.name),
      { id: 'about', label: 'About' },
    ],
    [b.gallery.length > 0, { id: 'gallery', label: 'Gallery' }],
    [Boolean(b.location?.address), { id: 'location', label: 'Address & hours' }],
    [Boolean(b.phone || b.email), { id: 'contact', label: 'Contact' }],
  ];

  return present.filter(([show]) => show).map(([, ref]) => ref);
}