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
