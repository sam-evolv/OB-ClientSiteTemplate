/**
 * Host / custom-domain normalisation for tenant resolution.
 *
 * Pure and dependency-free so it can be unit-tested in isolation and reused by
 * both the resolver and the metadata builder.
 *
 * The marketing site is served on both the apex and the "www." variant of a
 * tenant's domain (in production the apex 307-redirects to www.), and a tenant
 * row may store either variant. Matching therefore MUST be www-, case- and
 * port-insensitive on BOTH the request Host and the stored website_custom_domain.
 * A mismatch here returns null and 404s the tenant's own homepage — which is the
 * production trap this module exists to prevent.
 */

/** Normalise a Host header or stored domain: drop port, trim, lowercase, strip a leading "www.". */
export function normalizeHost(host: string | null | undefined): string {
  if (!host) return '';
  return host.split(':')[0].trim().toLowerCase().replace(/^www\./, '');
}

/**
 * True when a request host and a stored custom domain refer to the same site,
 * comparing both after normalisation (www/case/port-insensitive). An empty or
 * nullish value on either side never matches.
 */
export function hostMatchesDomain(
  host: string | null | undefined,
  storedDomain: string | null | undefined
): boolean {
  const normalised = normalizeHost(host);
  return normalised !== '' && normalised === normalizeHost(storedDomain);
}

/**
 * The Google Search Console verification token to emit for a request, or
 * undefined when none should render.
 *
 * Only the matched tenant's OWN custom-domain site carries its token: returns
 * the trimmed token when it is non-empty AND the request host is the tenant's
 * custom domain. Returns undefined otherwise — no token, blank token, no custom
 * domain, or a non-matching host (the demo fallback on localhost/*.vercel.app,
 * the slug route on a non-custom host, or an unmapped host). The returned string
 * is exactly the `content` value of <meta name="google-site-verification">.
 */
export function googleSiteVerification(
  token: string | null | undefined,
  host: string | null | undefined,
  storedDomain: string | null | undefined
): string | undefined {
  const trimmed = token?.trim();
  if (!trimmed) return undefined;
  return hostMatchesDomain(host, storedDomain) ? trimmed : undefined;
}

// --- Platform-subdomain tenant routing ---------------------------------------

/**
 * The single tenant label of a platform-subdomain host, or null when the host is
 * not a tenant subdomain of `parentDomain`.
 *
 *   "simplygolf365.openbook.ie", "openbook.ie"  -> "simplygolf365"
 *   "www.openbook.ie",           "openbook.ie"  -> null  (marketing root)
 *   "openbook.ie",               "openbook.ie"  -> null  (bare parent / root)
 *   "a.b.openbook.ie",           "openbook.ie"  -> null  (multi-label prefix)
 *   "simplygolf365.ie",          "openbook.ie"  -> null  (a custom domain)
 *
 * Port/case/whitespace-insensitive, and a leading "www." on the stored parent is
 * tolerated. The host is NOT run through normalizeHost: we must still SEE a
 * leading "www." label so it can be rejected as the marketing root rather than
 * treated as a slug. Only a single DNS label (no embedded dots) that is not the
 * reserved "www" host is accepted — a multi-label prefix can never equal a
 * single-token slug, so it is never a tenant subdomain. Returns null when
 * `parentDomain` is empty, which keeps subdomain routing inert until the
 * platform domain is configured.
 */
export function subdomainLabel(
  host: string | null | undefined,
  parentDomain: string | null | undefined
): string | null {
  const h = (host ?? '').split(':')[0].trim().toLowerCase();
  const parent = (parentDomain ?? '').split(':')[0].trim().toLowerCase().replace(/^www\./, '');
  if (!h || !parent) return null;
  if (h === parent) return null; // bare parent: the marketing root, not a tenant
  const suffix = `.${parent}`;
  if (!h.endsWith(suffix)) return null; // not under the parent domain at all
  const label = h.slice(0, -suffix.length);
  if (!label || label.includes('.') || label === 'www') return null;
  return label;
}

/**
 * Tenant-resolution precedence for a request host, as a pure, generic
 * higher-order function so the ORDER is unit-testable without a database or env.
 *
 * Precedence: an exact custom-domain match FIRST (via `byCustomDomain`), THEN a
 * platform-subdomain match (the `subdomainLabel` of the host, looked up via
 * `bySlug`). Returns the first non-null tenant, or null when neither matches —
 * the caller decides the remaining fallback (demo business / 404).
 *
 * Generic over the tenant type so this module stays dependency-free; resolve.ts
 * binds the real Supabase-backed resolvers. The custom-domain resolver runs (and
 * wins) before the subdomain is ever considered, so a custom domain that happens
 * to sit under the platform parent still resolves via its mapping, unchanged.
 */
export async function resolveTenantByHost<T>(
  host: string | null,
  parentDomain: string | null | undefined,
  resolvers: {
    byCustomDomain: (host: string | null) => Promise<T | null> | T | null;
    bySlug: (slug: string) => Promise<T | null> | T | null;
  }
): Promise<T | null> {
  const byDomain = await resolvers.byCustomDomain(host);
  if (byDomain) return byDomain;
  const label = subdomainLabel(host, parentDomain);
  if (!label) return null;
  return (await resolvers.bySlug(label)) ?? null;
}

// --- Master sitemap index (served at the platform root) ----------------------

/**
 * A tenant's canonical absolute origin, UNCONDITIONALLY: its custom domain when
 * set, else its platform subdomain "https://<slug>.<parent>". Null when it has
 * neither (no custom domain, and no platform parent configured to build a
 * subdomain).
 *
 * This is the tenant's canonical home regardless of which host is being served,
 * so it is what the master sitemap index lists. The per-request, host-GATED
 * variant — which yields the subdomain only when the request is actually on it —
 * is resolve.ts's canonicalOriginForHost, used for per-tenant canonical/metadata.
 */
export function tenantCanonicalOrigin(
  tenant: { slug?: string | null; customDomain?: string | null },
  parentDomain: string | null | undefined
): string | null {
  if (tenant.customDomain) return `https://${tenant.customDomain}`;
  const parent = normalizeHost(parentDomain);
  return parent && tenant.slug ? `https://${tenant.slug}.${parent}` : null;
}

/**
 * True when `host` is the platform root itself — the bare parent domain or its
 * "www." form (e.g. "sites.openbook.ie" / "www.sites.openbook.ie"). That host is
 * the marketing root, never a tenant; it is where the master sitemap index is
 * served. False when the platform domain is unset, keeping the feature inert.
 */
export function isPlatformRootHost(
  host: string | null | undefined,
  parentDomain: string | null | undefined
): boolean {
  const parent = normalizeHost(parentDomain);
  return parent !== '' && normalizeHost(host) === parent;
}

/**
 * The master sitemap-index entries for a set of published+live tenants: one
 * <loc> per tenant, each the tenant's OWN sitemap URL — its canonical origin
 * (custom domain, else platform subdomain "<slug>.<parent>") + "/sitemap.xml",
 * which is exactly the per-tenant sitemap that host already serves.
 *
 * Pure: derived from slug + custom domain + the platform parent only. Tenants
 * that can be placed at neither a custom domain nor a "<slug>.<parent>" subdomain
 * are skipped; duplicate locs are collapsed, order preserved.
 */
export function tenantSitemapIndexLocs(
  tenants: { slug?: string | null; customDomain?: string | null }[],
  parentDomain: string | null | undefined
): string[] {
  const locs: string[] = [];
  for (const t of tenants) {
    const origin = tenantCanonicalOrigin(t, parentDomain);
    if (origin) locs.push(`${origin}/sitemap.xml`);
  }
  return Array.from(new Set(locs));
}
