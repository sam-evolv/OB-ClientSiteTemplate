import { z } from 'zod';
import { SectionSchema } from './sections';

/**
 * Business row, the top-level object the page orchestrator consumes.
 * Sections are an ordered list. Sort by `display_order` at render time.
 *
 * The CTA labels here are business-level overrides for chrome elements
 * (StickyBookBar, Footer CTA, sticky nav button) so that a sauna, a
 * mobile-services business, and a fixed-location studio can use the
 * same chrome without the renderer hardcoding any English.
 */
export const BusinessSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  name: z.string().min(1),
  tagline: z.string().optional(),
  primary_colour: z
    .string()
    .regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, 'primary_colour must be a hex colour')
    .default('#F5F5F4'),
  domain: z.string().nullable().default(null),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  instagram: z.string().optional(),
  category: z.string(),
  founded_year: z.number().int().optional(),
  cta_primary_label: z.string().default('Book'),
  cta_sticky_label: z.string().default('Book'),
  cta_final_label: z.string().default('Get in touch'),
  sections: z.array(SectionSchema)
});

export type Business = z.infer<typeof BusinessSchema>;
