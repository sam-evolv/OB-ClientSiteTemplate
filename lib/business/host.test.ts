import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeHost,
  hostMatchesDomain,
  googleSiteVerification,
  subdomainLabel,
  resolveTenantByHost
} from './host.ts';

// resolveByHost matches a request host against each tenant's stored
// website_custom_domain by composing hostMatchesDomain over the published rows,
// so these pure tests cover the resolution logic that previously 404'd the live
// homepage on a www/apex mismatch.

test('normalizeHost collapses www, case and port to one key', () => {
  assert.equal(normalizeHost('www.simplygolf365.ie'), 'simplygolf365.ie');
  assert.equal(normalizeHost('simplygolf365.ie'), 'simplygolf365.ie');
  assert.equal(normalizeHost('SimplyGolf365.IE'), 'simplygolf365.ie');
  assert.equal(normalizeHost('www.simplygolf365.ie:443'), 'simplygolf365.ie');
  assert.equal(normalizeHost('WWW.SimplyGolf365.ie:8080'), 'simplygolf365.ie');
});

test('normalizeHost handles empty and nullish input', () => {
  assert.equal(normalizeHost(null), '');
  assert.equal(normalizeHost(undefined), '');
  assert.equal(normalizeHost(''), '');
  assert.equal(normalizeHost('   '), '');
});

test('an unrelated host does not collapse to the same key', () => {
  assert.notEqual(normalizeHost('other.ie'), normalizeHost('simplygolf365.ie'));
  // a deeper subdomain is not stripped (only a leading www.)
  assert.equal(normalizeHost('app.simplygolf365.ie'), 'app.simplygolf365.ie');
});

test('hostMatchesDomain resolves both directions when the row stores the www variant', () => {
  const stored = 'www.simplygolf365.ie';
  assert.equal(hostMatchesDomain('simplygolf365.ie', stored), true);
  assert.equal(hostMatchesDomain('www.simplygolf365.ie', stored), true);
  assert.equal(hostMatchesDomain('www.simplygolf365.ie:443', stored), true);
  assert.equal(hostMatchesDomain('SimplyGolf365.ie', stored), true);
});

test('hostMatchesDomain resolves both directions when the row stores the bare variant', () => {
  const stored = 'simplygolf365.ie';
  assert.equal(hostMatchesDomain('simplygolf365.ie', stored), true);
  assert.equal(hostMatchesDomain('www.simplygolf365.ie', stored), true);
  assert.equal(hostMatchesDomain('www.simplygolf365.ie:8080', stored), true);
});

test('hostMatchesDomain rejects unrelated, empty and nullish values', () => {
  assert.equal(hostMatchesDomain('other.ie', 'simplygolf365.ie'), false);
  assert.equal(hostMatchesDomain('', 'simplygolf365.ie'), false);
  assert.equal(hostMatchesDomain(null, 'simplygolf365.ie'), false);
  assert.equal(hostMatchesDomain('simplygolf365.ie', null), false);
  assert.equal(hostMatchesDomain(null, null), false);
});

// --- Google Search Console verification token (per-tenant <meta> content) ---

test('googleSiteVerification returns the token for the matched tenant (the meta content)', () => {
  // www/apex symmetric, like host matching, so it works whichever variant is stored.
  assert.equal(
    googleSiteVerification('tok_ABC123', 'www.simplygolf365.ie', 'www.simplygolf365.ie'),
    'tok_ABC123'
  );
  assert.equal(
    googleSiteVerification('tok_ABC123', 'simplygolf365.ie', 'www.simplygolf365.ie'),
    'tok_ABC123'
  );
  assert.equal(
    googleSiteVerification('tok_ABC123', 'www.simplygolf365.ie', 'simplygolf365.ie'),
    'tok_ABC123'
  );
});

test('googleSiteVerification emits NOTHING when the token is null or blank', () => {
  assert.equal(googleSiteVerification(null, 'www.simplygolf365.ie', 'www.simplygolf365.ie'), undefined);
  assert.equal(googleSiteVerification(undefined, 'www.simplygolf365.ie', 'www.simplygolf365.ie'), undefined);
  assert.equal(googleSiteVerification('   ', 'www.simplygolf365.ie', 'www.simplygolf365.ie'), undefined);
});

test('googleSiteVerification emits NOTHING on the demo fallback / non-matching host even with a token', () => {
  assert.equal(googleSiteVerification('tok_ABC123', 'localhost', 'www.simplygolf365.ie'), undefined);
  assert.equal(
    googleSiteVerification('tok_ABC123', 'ob-client-site-template.vercel.app', 'www.simplygolf365.ie'),
    undefined
  );
  assert.equal(googleSiteVerification('tok_ABC123', 'other.ie', 'www.simplygolf365.ie'), undefined);
});

test('googleSiteVerification emits NOTHING for a tenant with no custom domain', () => {
  assert.equal(googleSiteVerification('tok_ABC123', 'whatever.ie', null), undefined);
});

// --- subdomainLabel: platform-subdomain (<slug>.<PARENT>) extraction ----------

test('subdomainLabel extracts the tenant slug from "<slug>.<parent>"', () => {
  assert.equal(subdomainLabel('simplygolf365.openbook.ie', 'openbook.ie'), 'simplygolf365');
  // case- and port-insensitive, like the rest of host matching
  assert.equal(subdomainLabel('SimplyGolf365.OpenBook.ie:443', 'openbook.ie'), 'simplygolf365');
  // a leading "www." on the stored parent is tolerated
  assert.equal(subdomainLabel('simplygolf365.openbook.ie', 'www.openbook.ie'), 'simplygolf365');
});

test('subdomainLabel treats the bare parent and www.<parent> as the marketing root, not a tenant', () => {
  assert.equal(subdomainLabel('openbook.ie', 'openbook.ie'), null);
  assert.equal(subdomainLabel('openbook.ie:443', 'openbook.ie'), null);
  assert.equal(subdomainLabel('www.openbook.ie', 'openbook.ie'), null);
  assert.equal(subdomainLabel('WWW.OpenBook.ie', 'openbook.ie'), null);
});

test('subdomainLabel rejects multi-label prefixes (a slug is a single token)', () => {
  assert.equal(subdomainLabel('a.b.openbook.ie', 'openbook.ie'), null);
  assert.equal(subdomainLabel('www.simplygolf365.openbook.ie', 'openbook.ie'), null);
});

test('subdomainLabel does not match a custom domain or a host that merely contains the parent', () => {
  // a tenant's custom domain is NOT under the platform parent — left for resolveByHost
  assert.equal(subdomainLabel('simplygolf365.ie', 'openbook.ie'), null);
  assert.equal(subdomainLabel('www.simplygolf365.ie', 'openbook.ie'), null);
  // a substring of the parent is not a subdomain of it
  assert.equal(subdomainLabel('notopenbook.ie', 'openbook.ie'), null);
  assert.equal(subdomainLabel('evil-openbook.ie', 'openbook.ie'), null);
});

test('subdomainLabel is inert when the parent domain or host is empty/nullish', () => {
  assert.equal(subdomainLabel('simplygolf365.openbook.ie', ''), null);
  assert.equal(subdomainLabel('simplygolf365.openbook.ie', null), null);
  assert.equal(subdomainLabel('simplygolf365.openbook.ie', undefined), null);
  assert.equal(subdomainLabel(null, 'openbook.ie'), null);
  assert.equal(subdomainLabel('', 'openbook.ie'), null);
  assert.equal(subdomainLabel('   ', 'openbook.ie'), null);
});

// --- resolveTenantByHost: custom-domain-FIRST, THEN-subdomain precedence ------
//
// Stands in tiny fake resolvers for the Supabase-backed ones resolve.ts binds in
// production (byCustomDomain == resolveByHost, bySlug == resolveBySlug), so the
// resolution ORDER is proven without a database. `bySlug` records its calls so
// we can assert the slug lookup is NEVER reached for a custom-domain host or for
// the marketing root ("www" / "").

const PARENT = 'openbook.ie';
type FakeTenant = { id: string };
const CUSTOM: FakeTenant = { id: 'via-custom-domain' };
const SUB: FakeTenant = { id: 'via-subdomain' };

function makeResolvers(opts: { customDomain?: string | null; slug?: string } = {}) {
  const calls = { bySlug: [] as string[] };
  const resolvers = {
    byCustomDomain: async (host: string | null): Promise<FakeTenant | null> =>
      hostMatchesDomain(host, opts.customDomain ?? null) ? CUSTOM : null,
    bySlug: async (slug: string): Promise<FakeTenant | null> => {
      calls.bySlug.push(slug);
      return slug === (opts.slug ?? 'simplygolf365') ? SUB : null;
    }
  };
  return { resolvers, calls };
}

test('resolveTenantByHost resolves a published subdomain "<slug>.<parent>" by slug', async () => {
  const { resolvers, calls } = makeResolvers();
  assert.equal(await resolveTenantByHost('simplygolf365.openbook.ie', PARENT, resolvers), SUB);
  assert.deepEqual(calls.bySlug, ['simplygolf365']);
});

test('resolveTenantByHost lets the custom-domain match WIN over the subdomain', async () => {
  // A host that is BOTH a custom domain and a platform subdomain must resolve via
  // the custom domain, and must not even consult the slug lookup.
  const { resolvers, calls } = makeResolvers({ customDomain: 'simplygolf365.openbook.ie' });
  assert.equal(await resolveTenantByHost('simplygolf365.openbook.ie', PARENT, resolvers), CUSTOM);
  assert.deepEqual(calls.bySlug, []); // subdomain lookup never reached
});

test('resolveTenantByHost resolves an ordinary custom domain unchanged, never via the slug path', async () => {
  const { resolvers, calls } = makeResolvers({ customDomain: 'www.simplygolf365.ie' });
  // apex and www both resolve via the custom-domain path, exactly as before
  assert.equal(await resolveTenantByHost('simplygolf365.ie', PARENT, resolvers), CUSTOM);
  assert.equal(await resolveTenantByHost('www.simplygolf365.ie', PARENT, resolvers), CUSTOM);
  assert.deepEqual(calls.bySlug, []);
});

test('resolveTenantByHost does NOT resolve www.<parent> or the bare parent as tenants', async () => {
  const { resolvers, calls } = makeResolvers();
  assert.equal(await resolveTenantByHost('www.openbook.ie', PARENT, resolvers), null);
  assert.equal(await resolveTenantByHost('openbook.ie', PARENT, resolvers), null);
  assert.deepEqual(calls.bySlug, []); // never tries to resolve "www" or "" as a slug
});

test('resolveTenantByHost resolves an unknown subdomain to null (clean 404)', async () => {
  const { resolvers, calls } = makeResolvers();
  assert.equal(await resolveTenantByHost('nope.openbook.ie', PARENT, resolvers), null);
  assert.deepEqual(calls.bySlug, ['nope']); // looked the slug up, found nothing
});

test('resolveTenantByHost is inert when the platform parent domain is unset', async () => {
  const { resolvers, calls } = makeResolvers();
  assert.equal(await resolveTenantByHost('simplygolf365.openbook.ie', '', resolvers), null);
  assert.deepEqual(calls.bySlug, []); // no parent -> no subdomain lookup
});
