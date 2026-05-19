import type { BusinessRow, ServiceRow } from '@/lib/schemas/business';

/**
 * Services rendered as tabbed groups, one tab per distinct group_name.
 * Internal to Services.tsx.
 */
export function ServicesTabbed({
  business: _business,
  services
}: {
  business: BusinessRow;
  services: ServiceRow[];
}) {
  const groups = new Map<string, ServiceRow[]>();
  for (const s of services) {
    const key = s.group_name && s.group_name.length > 0 ? s.group_name : 'Services';
    const bucket = groups.get(key) ?? [];
    bucket.push(s);
    groups.set(key, bucket);
  }
  return (
    <section id="events" data-section-type="services_tabbed" className="px-5 py-24 border-b border-white/5">
      <ul className="flex flex-wrap gap-3">
        {Array.from(groups.entries()).map(([title, items]) => (
          <li
            key={title}
            className="font-mono text-[11px] uppercase tracking-[0.1em] border border-white/10 rounded px-3 py-1.5 opacity-80"
          >
            {title} ({items.length})
          </li>
        ))}
      </ul>
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] opacity-40">
        TODO: implement services_tabbed
      </p>
    </section>
  );
}
