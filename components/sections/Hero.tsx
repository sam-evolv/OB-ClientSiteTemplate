import type { BusinessRow } from '@/lib/schemas/business';
import { HeroPhoto } from './HeroPhoto';
import { HeroTypeLed } from './HeroTypeLed';

/**
 * Hero dispatch. Internally polymorphic.
 *
 * Variant decision:
 * - website_hero_image_url present: hero_photo
 * - otherwise: hero_type_led
 *
 * The dispatch never returns null. Every business has a name and at
 * least a tagline-or-empty headline, so the hero always renders.
 */
export function Hero({ business }: { business: BusinessRow }) {
  if (business.website_hero_image_url) {
    return <HeroPhoto business={business} />;
  }
  return <HeroTypeLed business={business} />;
}
