import type { BusinessRow, ServiceRow } from '@/lib/schemas/business';

/**
 * Services rendered as a flat list, used when no service has a
 * group_name. Internal to Services.tsx.
 */
export function ServicesFlat({
  business: _business,
  services
}: {
  business: BusinessRow;
  services: ServiceRow[];
}) {
  return (
    <section id="services" data-section-type="services_flat" className="px-5 py-24 border-b border-white/5">
      <p className="opacity-85">{services.length} service{services.length === 1 ? '' : 's'}.</p>
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] opacity-40">
        TODO: implement services_flat
      </p>
    </section>
  );
}
