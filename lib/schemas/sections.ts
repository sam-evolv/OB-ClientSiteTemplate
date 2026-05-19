import { z } from 'zod';

/**
 * Section schemas for the OpenBook customer marketing site template.
 *
 * One Zod schema per section type from the brief, Part 2. The discriminated
 * union exported at the bottom is the single source of truth that the page
 * orchestrator, the renderer map, and the (future) Supabase loader all
 * validate against.
 *
 * Each section row has the shape { id, type, display_order, config, content }
 * matching the `sections` table. `config` is intentionally kept open per
 * section: business-level toggles that do not change the content live there
 * (eg. services_tabbed.config.popular_tag_label).
 */

// -----------------------------------------------------------------------------
// Shared fragments
// -----------------------------------------------------------------------------

const SectionBase = {
  id: z.string().uuid(),
  display_order: z.number().int().nonnegative()
};

const CtaSchema = z.object({
  label: z.string(),
  target_section: z.string()
});

// -----------------------------------------------------------------------------
// hero_photo
// -----------------------------------------------------------------------------

export const HeroPhotoContentSchema = z.object({
  headline_line_1: z.string(),
  headline_line_2: z.string(),
  italic_accent_phrase: z.string(),
  subhead: z.string(),
  hero_image_id: z.string().uuid(),
  primary_cta: CtaSchema,
  secondary_cta: CtaSchema.optional()
});

export const HeroPhotoSectionSchema = z.object({
  ...SectionBase,
  type: z.literal('hero_photo'),
  config: z.object({}).passthrough().default({}),
  content: HeroPhotoContentSchema
});

// -----------------------------------------------------------------------------
// hero_type_led
// -----------------------------------------------------------------------------

export const HeroTypeLedContentSchema = z.object({
  headline_line_1: z.string(),
  headline_line_2: z.string(),
  italic_accent_phrase: z.string(),
  subhead: z.string(),
  background: z.enum(['plain', 'gradient']),
  primary_cta: CtaSchema,
  secondary_cta: CtaSchema.optional()
});

export const HeroTypeLedSectionSchema = z.object({
  ...SectionBase,
  type: z.literal('hero_type_led'),
  config: z.object({}).passthrough().default({}),
  content: HeroTypeLedContentSchema
});

// -----------------------------------------------------------------------------
// trust_bar
// -----------------------------------------------------------------------------

export const TrustBarContentSchema = z.object({
  pills: z.array(z.object({ label: z.string() })).min(3).max(5)
});

export const TrustBarSectionSchema = z.object({
  ...SectionBase,
  type: z.literal('trust_bar'),
  config: z.object({}).passthrough().default({}),
  content: TrustBarContentSchema
});

// -----------------------------------------------------------------------------
// mission
// -----------------------------------------------------------------------------

export const MissionContentSchema = z.object({
  statement: z.string(),
  highlight_word: z.string().optional(),
  signed_by: z.string().optional()
});

export const MissionSectionSchema = z.object({
  ...SectionBase,
  type: z.literal('mission'),
  config: z.object({}).passthrough().default({}),
  content: MissionContentSchema
});

// -----------------------------------------------------------------------------
// services (tabbed and flat)
// -----------------------------------------------------------------------------

const ServiceItemSchema = z.object({
  name: z.string(),
  duration: z.string(),
  price: z.number().nonnegative().nullable(),
  description: z.string(),
  popular: z.boolean()
});

export const ServicesTabbedContentSchema = z.object({
  intro_headline: z.string(),
  intro_subhead: z.string().optional(),
  italic_accent_phrase: z.string().optional(),
  groups: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      blurb: z.string(),
      services: z.array(ServiceItemSchema)
    })
  ).min(1)
});

export const ServicesTabbedSectionSchema = z.object({
  ...SectionBase,
  type: z.literal('services_tabbed'),
  config: z.object({
    popular_tag_label: z.string().default('Most popular')
  }).passthrough().default({ popular_tag_label: 'Most popular' }),
  content: ServicesTabbedContentSchema
});

export const ServicesFlatContentSchema = z.object({
  intro_headline: z.string(),
  intro_subhead: z.string().optional(),
  italic_accent_phrase: z.string().optional(),
  services: z.array(ServiceItemSchema)
});

export const ServicesFlatSectionSchema = z.object({
  ...SectionBase,
  type: z.literal('services_flat'),
  config: z.object({
    popular_tag_label: z.string().default('Most popular')
  }).passthrough().default({ popular_tag_label: 'Most popular' }),
  content: ServicesFlatContentSchema
});

// -----------------------------------------------------------------------------
// gallery_mosaic
// -----------------------------------------------------------------------------

const GalleryImageItemSchema = z.object({
  type: z.literal('image'),
  media_id: z.string().uuid(),
  caption: z.string().optional()
});

const GalleryVideoItemSchema = z.object({
  type: z.literal('video'),
  poster_media_id: z.string().uuid(),
  video_url: z.string().nullable(),
  label: z.string().optional(),
  caption: z.string().optional()
});

export const GalleryMosaicContentSchema = z.object({
  intro_headline: z.string(),
  italic_accent_phrase: z.string().optional(),
  eyebrow: z.string(),
  fallback_label: z.string(),
  items: z.array(z.discriminatedUnion('type', [GalleryImageItemSchema, GalleryVideoItemSchema]))
});

export const GalleryMosaicSectionSchema = z.object({
  ...SectionBase,
  type: z.literal('gallery_mosaic'),
  config: z.object({}).passthrough().default({}),
  content: GalleryMosaicContentSchema
});

// -----------------------------------------------------------------------------
// location_fixed
// -----------------------------------------------------------------------------

export const LocationFixedContentSchema = z.object({
  eyebrow: z.string(),
  headline: z.string(),
  italic_accent_phrase: z.string().optional(),
  subhead: z.string(),
  address_line_1: z.string(),
  address_line_2: z.string().optional(),
  city: z.string(),
  eircode: z.string(),
  parking: z.string().optional(),
  public_transport: z.string().optional(),
  hours: z.object({
    mon: z.string(),
    tue: z.string(),
    wed: z.string(),
    thu: z.string(),
    fri: z.string(),
    sat: z.string(),
    sun: z.string()
  }),
  map: z.object({
    lat: z.number(),
    lng: z.number(),
    embed_url: z.string().optional()
  })
});

export const LocationFixedSectionSchema = z.object({
  ...SectionBase,
  type: z.literal('location_fixed'),
  config: z.object({}).passthrough().default({}),
  content: LocationFixedContentSchema
});

// -----------------------------------------------------------------------------
// location_mobile
// -----------------------------------------------------------------------------

export const LocationMobileContentSchema = z.object({
  eyebrow: z.string(),
  headline: z.string(),
  italic_accent_phrase: z.string().optional(),
  subhead: z.string(),
  zones: z.array(
    z.object({
      label: z.string(),
      name: z.string(),
      description: z.string(),
      is_primary: z.boolean()
    })
  ),
  venue_requirements: z.object({
    eyebrow: z.string(),
    items: z.array(z.object({ stat: z.string(), label: z.string() })),
    callout: z.string()
  }).optional()
});

export const LocationMobileSectionSchema = z.object({
  ...SectionBase,
  type: z.literal('location_mobile'),
  config: z.object({}).passthrough().default({}),
  content: LocationMobileContentSchema
});

// -----------------------------------------------------------------------------
// social_proof_press
// -----------------------------------------------------------------------------

export const SocialProofPressContentSchema = z.object({
  eyebrow: z.string(),
  headline: z.string(),
  italic_accent_phrase: z.string().optional(),
  press: z.array(
    z.object({
      outlet: z.string(),
      title: z.string(),
      date: z.string(),
      url: z.string().optional()
    })
  ),
  founder_quote: z.object({
    text: z.string(),
    attribution: z.string()
  }).optional()
});

export const SocialProofPressSectionSchema = z.object({
  ...SectionBase,
  type: z.literal('social_proof_press'),
  config: z.object({}).passthrough().default({}),
  content: SocialProofPressContentSchema
});

// -----------------------------------------------------------------------------
// social_proof_reviews
// -----------------------------------------------------------------------------

export const SocialProofReviewsContentSchema = z.object({
  eyebrow: z.string(),
  headline: z.string(),
  reviews: z.array(
    z.object({
      quote: z.string(),
      author: z.string(),
      role: z.string().optional(),
      context: z.string().optional(),
      photo_media_id: z.string().uuid().optional(),
      date: z.string(),
      rating: z.number().min(0).max(5).optional()
    })
  )
});

export const SocialProofReviewsSectionSchema = z.object({
  ...SectionBase,
  type: z.literal('social_proof_reviews'),
  config: z.object({}).passthrough().default({}),
  content: SocialProofReviewsContentSchema
});

// -----------------------------------------------------------------------------
// about
// -----------------------------------------------------------------------------

export const AboutContentSchema = z.object({
  eyebrow: z.string(),
  headline: z.string(),
  body: z.string(),
  founder: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string()
  }),
  portrait_media_id: z.string().uuid().optional(),
  portrait_caption: z.string().optional()
});

export const AboutSectionSchema = z.object({
  ...SectionBase,
  type: z.literal('about'),
  config: z.object({}).passthrough().default({}),
  content: AboutContentSchema
});

// -----------------------------------------------------------------------------
// contact
// -----------------------------------------------------------------------------

export const ContactContentSchema = z.object({
  headline: z.string(),
  italic_accent_phrase: z.string().optional(),
  subhead: z.string(),
  contact_methods: z.array(
    z.object({
      type: z.enum(['phone', 'email', 'instagram']),
      value: z.string(),
      label: z.string()
    })
  ),
  cta_label: z.string(),
  cta_action: z.enum(['mailto', 'tel', 'booking_form'])
});

export const ContactSectionSchema = z.object({
  ...SectionBase,
  type: z.literal('contact'),
  config: z.object({}).passthrough().default({}),
  content: ContactContentSchema
});

// -----------------------------------------------------------------------------
// Discriminated union
// -----------------------------------------------------------------------------

export const SectionSchema = z.discriminatedUnion('type', [
  HeroPhotoSectionSchema,
  HeroTypeLedSectionSchema,
  TrustBarSectionSchema,
  MissionSectionSchema,
  ServicesTabbedSectionSchema,
  ServicesFlatSectionSchema,
  GalleryMosaicSectionSchema,
  LocationFixedSectionSchema,
  LocationMobileSectionSchema,
  SocialProofPressSectionSchema,
  SocialProofReviewsSectionSchema,
  AboutSectionSchema,
  ContactSectionSchema
]);

export type Section = z.infer<typeof SectionSchema>;
export type SectionType = Section['type'];
