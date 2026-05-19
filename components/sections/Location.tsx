import { z } from 'zod';
import {
  TravelZoneSchema,
  VenueRequirementSchema,
  type BusinessHour,
  type BusinessRow,
  type TravelZone,
  type VenueRequirement
} from '@/lib/schemas/business';
import { LocationMobile } from './LocationMobile';
import { LocationFixed } from './LocationFixed';

/**
 * Location dispatch. Internally polymorphic.
 *
 * Variant decision, in order:
 * - business.travel_zones present and refines: mobile
 * - business.address_line present: fixed
 * - neither: returns null
 *
 * Refinement of the JSONB columns happens here so the variant
 * components receive concrete types.
 */
export function Location({
  business,
  hours
}: {
  business: BusinessRow;
  hours: BusinessHour[];
}) {
  if (business.travel_zones) {
    const zonesParse = z.array(TravelZoneSchema).safeParse(business.travel_zones);
    if (zonesParse.success && zonesParse.data.length > 0) {
      const zones: TravelZone[] = zonesParse.data;
      let venueRequirements: VenueRequirement | null = null;
      if (business.venue_requirements) {
        const vrParse = VenueRequirementSchema.safeParse(business.venue_requirements);
        if (vrParse.success) venueRequirements = vrParse.data;
      }
      return (
        <LocationMobile business={business} zones={zones} venueRequirements={venueRequirements} />
      );
    }
  }
  if (business.address_line || business.address) {
    return <LocationFixed business={business} hours={hours} />;
  }
  return null;
}
