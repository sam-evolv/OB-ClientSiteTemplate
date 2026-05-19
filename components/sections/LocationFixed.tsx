import type { BusinessRow, BusinessHour } from '@/lib/schemas/business';

/**
 * Fixed-location section. Address, hours grid, parking, transport, map.
 * Internal to Location.tsx.
 */
export function LocationFixed({
  business,
  hours
}: {
  business: BusinessRow;
  hours: BusinessHour[];
}) {
  return (
    <section data-section-type="location_fixed" className="px-5 py-24 border-b border-white/5">
      <address className="not-italic opacity-85">
        {business.address_line ?? business.address}
        {business.city ? `, ${business.city}` : ''}
      </address>
      <p className="mt-4 opacity-75">{hours.length} hour rows.</p>
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] opacity-40">
        TODO: implement location_fixed
      </p>
    </section>
  );
}
