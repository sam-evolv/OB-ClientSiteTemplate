import { test } from 'node:test';
import assert from 'node:assert/strict';
import { passwordProblem } from './password.ts';

// The owner account edits a live website and the sign-in page is public, so the
// rules here are load-bearing rather than cosmetic. These pin the shapes someone
// actually reaches for on a gym or admin login.

test('rejects anything shorter than ten characters', () => {
  assert.equal(passwordProblem('gym12345'), 'Use at least 10 characters.');
  assert.equal(passwordProblem(''), 'Use at least 10 characters.');
});

test('rejects a password with no letter', () => {
  assert.equal(passwordProblem('1234567890'), 'Include at least one letter.');
});

test('rejects a password with no number', () => {
  assert.equal(passwordProblem('empiregymcork'), 'Include at least one number.');
});

test('rejects the obvious gym and admin shapes by name', () => {
  assert.equal(passwordProblem('admin12345'), 'That password is too easy to guess.');
  assert.equal(passwordProblem('empiregym26'), 'That password is too easy to guess.');
  assert.equal(passwordProblem('GymAdmin26'), 'That password is too easy to guess.');
  assert.equal(passwordProblem('changeme12'), 'That password is too easy to guess.');
});

test('length is checked before the blocklist, so a short guess reads as too short', () => {
  assert.equal(passwordProblem('gym123456'), 'Use at least 10 characters.');
});

test('accepts a passphrase containing a number, and a long mixed password', () => {
  assert.equal(passwordProblem('copper-harbour-7-lantern'), null);
  assert.equal(passwordProblem('MatthewHill99'), null);
});