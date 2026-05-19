import type { Section } from '@/lib/schemas/sections';
import type { Business } from '@/lib/schemas/business';
import { HeroPhoto } from './HeroPhoto';
import { HeroTypeLed } from './HeroTypeLed';
import { TrustBar } from './TrustBar';
import { Mission } from './Mission';
import { ServicesTabbed } from './ServicesTabbed';
import { ServicesFlat } from './ServicesFlat';
import { GalleryMosaic } from './GalleryMosaic';
import { LocationFixed } from './LocationFixed';
import { LocationMobile } from './LocationMobile';
import { SocialProofPress } from './SocialProofPress';
import { SocialProofReviews } from './SocialProofReviews';
import { About } from './About';
import { Contact } from './Contact';

/**
 * Renderer map. Keep this dumb: a single switch from section type to its
 * component. New section types do not change the page orchestrator, they
 * add an entry here and a Zod schema in lib/schemas/sections.ts.
 */
const COMPONENTS = {
  hero_photo: HeroPhoto,
  hero_type_led: HeroTypeLed,
  trust_bar: TrustBar,
  mission: Mission,
  services_tabbed: ServicesTabbed,
  services_flat: ServicesFlat,
  gallery_mosaic: GalleryMosaic,
  location_fixed: LocationFixed,
  location_mobile: LocationMobile,
  social_proof_press: SocialProofPress,
  social_proof_reviews: SocialProofReviews,
  about: About,
  contact: Contact
} as const;

export function renderSection(section: Section, business: Business) {
  const Component = COMPONENTS[section.type];
  if (!Component) {
    console.warn(`Unknown section type: ${(section as Section).type}`);
    return null;
  }
  // The narrowing within each Component is enforced by SectionProps<T>, but
  // the renderer-level dispatch cannot prove that to TypeScript. The map
  // above is the safety guarantee at runtime.
  const Typed = Component as React.ComponentType<{
    section: Section;
    business: Business;
    accent: string;
  }>;
  return <Typed key={section.id} section={section} business={business} accent={business.primary_colour} />;
}
