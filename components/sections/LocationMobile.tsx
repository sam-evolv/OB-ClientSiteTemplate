import type { BusinessRow, TravelZone, VenueRequirement } from '@/lib/schemas/business';

/**
 * Mobile-business location section. Travel zones and optional venue
 * requirements. Internal to Location.tsx; receives parsed zones and
 * venue requirements rather than re-parsing.
 */
export function LocationMobile({
  business: _business,
  zones,
  venueRequirements: _venueRequirements
}: {
  business: BusinessRow;
  zones: TravelZone[];
  venueRequirements: VenueRequirement | null;
}) {
  return (
    <section data-section-type="location_mobile" className="px-5 py-24 border-b border-white/5">
      <p className="opacity-85">{zones.length} travel zone{zones.length === 1 ? '' : 's'}.</p>
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] opacity-40">
        TODO: implement location_mobile
      </p>
    </section>
  );
}
