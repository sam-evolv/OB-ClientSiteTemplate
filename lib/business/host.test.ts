import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeHost, hostMatchesDomain } from './host.ts';

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
