import { z } from 'zod';

/**
 * Schemas for the OpenBook marketing site.
 *
 * The shapes here mirror the production `businesses`, `services`,
 * `business_hours`, and `business_media` tables in the OpenBook database
 * (Supabase project nrntaowmmemhjfxjqjch). The marketing site reads
 * directly from these tables, never from a separate sections table.
 *
 * JSONB columns (team, testimonials, offers, travel_zones, press_mentions,
 * trust_signals, venue_requirements) stay as z.unknown().nullable() at the
 * boundary. The section components that consume them refine to concrete
 * shapes (TravelZoneSchema, PressMentionSchema, etc.) and skip render if
 * the refinement fails. This keeps the loader forgiving and the consumers
 * strict.
 */

// -----------------------------------------------------------------------------
// businesses row
// -----------------------------------------------------------------------------

export const BusinessRowSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  tagline: z.string().nullable(),
  description: z.string().nullable(),
  category: z.string(),
  city: z.string().nullable(),
  address: z.string().nullable(),
  address_line: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  website: z.string().nullable(),
  instagram_handle: z.string().nullable(),
  primary_colour: z.string().nullable(),
  secondary_colour: z.string().nullable(),
  logo_url: z.string().nullable(),
  hero_image_url: z.string().nullable(),
  cover_image_url: z.string().nullable(),
  is_live: z.boolean().nullable(),
  whatsapp_number: z.string().nullable(),
  about_long: z.string().nullable(),
  gallery_urls: z.array(z.string()).nullable(),
  team: z.unknown().nullable(),
  testimonials: z.unknown().nullable(),
  offers: z.unknown().nullable(),
  founder_name: z.string().nullable(),
  founder_photo_url: z.string().nullable(),
  year_founded: z.number().nullable(),
  socials: z.record(z.string(), z.string()).nullable(),
  space_description: z.string().nullable(),
  amenities: z.array(z.string()).nullable(),
  accessibility_notes: z.string().nullable(),
  parking_info: z.string().nullable(),
  nearest_landmark: z.string().nullable(),
  public_transport_info: z.string().nullable(),
  website_is_published: z.boolean(),
  website_custom_domain: z.string().nullable(),
  website_headline: z.string().nullable(),

  // Added in the foundation-correction migration 20260519121524.
  mission_statement: z.string().nullable(),
  mission_highlight_word: z.string().nullable(),
  website_hero_headline_1: z.string().nullable(),
  website_hero_headline_2: z.string().nullable(),
  website_hero_subhead: z.string().nullable(),
  website_hero_image_url: z.string().nullable(),
  website_about_headline: z.string().nullable(),
  travel_zones: z.unknown().nullable(),
  press_mentions: z.unknown().nullable(),
  trust_signals: z.unknown().nullable(),
  venue_requirements: z.unknown().nullable(),

  // Added for the SIMply Golf 365 handoff (§5 column map). All nullable so
  // businesses that predate these columns still parse. .optional() guards the
  // case where the live row is selected before the migration lands.
  website_hero_variant: z.string().nullable().optional(),
  website_about_body: z.string().nullable().optional(),
  founder_role: z.string().nullable().optional(),
  founder_bio: z.string().nullable().optional(),
  instagram_url: z.string().nullable().optional(),
  website_stats: z.unknown().nullable().optional()
});

export type BusinessRow = z.infer<typeof BusinessRowSchema>;

// -----------------------------------------------------------------------------
// Structured JSONB shapes. Used inside section components, refined per call.
// -----------------------------------------------------------------------------

export const TravelZoneSchema = z.object({
  label: z.string(),
  name: z.string(),
  description: z.string(),
  is_primary: z.boolean()
});
export type TravelZone = z.infer<typeof TravelZoneSchema>;

export const PressMentionSchema = z.object({
  outlet: z.string(),
  title: z.string(),
  date: z.string(),
  url: z.string().nullable().optional()
});
export type PressMention = z.infer<typeof PressMentionSchema>;

export const TrustSignalSchema = z.object({
  label: z.string()
});
export type TrustSignal = z.infer<typeof TrustSignalSchema>;

export const VenueRequirementSchema = z.object({
  eyebrow: z.string(),
  items: z.array(z.object({ stat: z.string(), label: z.string() })),
  callout: z.string()
});
export type VenueRequirement = z.infer<typeof VenueRequirementSchema>;

export const TestimonialSchema = z.object({
  quote: z.string(),
  author: z.string(),
  role: z.string().nullable().optional(),
  context: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  rating: z.number().min(0).max(5).nullable().optional()
});
export type Testimonial = z.infer<typeof TestimonialSchema>;

// -----------------------------------------------------------------------------
// services row
// -----------------------------------------------------------------------------

export const ServiceRowSchema = z.object({
  id: z.string().uuid(),
  business_id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  duration_minutes: z.number(),
  price_cents: z.number(),
  capacity: z.number().nullable(),
  is_active: z.boolean().nullable(),
  sort_order: z.number().nullable(),
  group_name: z.string().nullable(),

  // Added for the handoff (§5): the marketing card shows a free-text duration
  // ("4 hours", "5 × 60 min", "Bespoke") that does not map cleanly from
  // duration_minutes, a "Most popular" decoy flag, and a per-group blurb.
  duration_label: z.string().nullable().optional(),
  is_popular: z.boolean().nullable().optional(),
  group_blurb: z.string().nullable().optional()
});
export type ServiceRow = z.infer<typeof ServiceRowSchema>;

// -----------------------------------------------------------------------------
// business_hours row
// -----------------------------------------------------------------------------

export const BusinessHourSchema = z.object({
  id: z.string().uuid(),
  business_id: z.string().uuid(),
  day_of_week: z.number().min(0).max(6),
  is_open: z.boolean().nullable(),
  open_time: z.string().nullable(),
  close_time: z.string().nullable(),
  is_closed: z.boolean().nullable()
});
export type BusinessHour = z.infer<typeof BusinessHourSchema>;

// -----------------------------------------------------------------------------
// business_media row
// -----------------------------------------------------------------------------

export const BusinessMediaSchema = z.object({
  id: z.string().uuid(),
  business_id: z.string().uuid(),
  url: z.string(),
  caption: z.string().nullable(),
  // The handoff uses semantic kinds (logo / hero / about / gallery) on top of
  // the original booking-app kinds. The migration widens the CHECK constraint
  // to allow both sets; the loader accepts any of them.
  kind: z.enum([
    'interior',
    'exterior',
    'service',
    'team',
    'logo',
    'hero',
    'about',
    'gallery'
  ]),
  sort_order: z.number().nullable(),

  // Added for the handoff (§5): gallery items can be image or video (poster in
  // `url`, the clip in `video_url`), with alt text and an optional overlay label.
  media_type: z.enum(['image', 'video']).nullable().optional(),
  video_url: z.string().nullable().optional(),
  alt: z.string().nullable().optional(),
  label: z.string().nullable().optional()
});
export type BusinessMedia = z.infer<typeof BusinessMediaSchema>;

// -----------------------------------------------------------------------------
// Composite, what the page loader returns.
// -----------------------------------------------------------------------------

export const BusinessForMarketingSchema = z.object({
  business: BusinessRowSchema,
  services: z.array(ServiceRowSchema),
  hours: z.array(BusinessHourSchema),
  media: z.array(BusinessMediaSchema)
});
export type BusinessForMarketing = z.infer<typeof BusinessForMarketingSchema>;
