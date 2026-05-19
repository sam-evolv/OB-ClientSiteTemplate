import type { BusinessRow, ServiceRow } from '@/lib/schemas/business';
import { ServicesTabbed } from './ServicesTabbed';
import { ServicesFlat } from './ServicesFlat';

/**
 * Services dispatch. Internally polymorphic.
 *
 * Variant decision:
 * - no services: returns null
 * - any service has a group_name: tabbed
 * - all services have null group_name: flat
 */
export function Services({
  business,
  services
}: {
  business: BusinessRow;
  services: ServiceRow[];
}) {
  if (services.length === 0) return null;
  const hasGroups = services.some((s) => s.group_name !== null && s.group_name.length > 0);
  if (hasGroups) {
    return <ServicesTabbed business={business} services={services} />;
  }
  return <ServicesFlat business={business} services={services} />;
}
