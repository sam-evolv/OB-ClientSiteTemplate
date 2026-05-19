import type { Section } from '@/lib/schemas/sections';
import type { Business } from '@/lib/schemas/business';

/**
 * Component contract for every section component.
 * Each section receives only its own typed slice of the discriminated union,
 * the parent Business (for chrome-level fields like CTA labels), and a
 * resolved accent colour string.
 */
export type SectionProps<T extends Section['type']> = {
  section: Extract<Section, { type: T }>;
  business: Business;
  accent: string;
};
