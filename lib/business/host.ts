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
