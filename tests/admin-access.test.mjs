import test from 'node:test';
import assert from 'node:assert/strict';
import { authorizeAdmin } from '../src/lib/admin-access.ts';
const request = (token) => new Request('http://localhost/api/generate-puzzles', {headers: token ? {authorization: `Bearer ${token}`} : {}});
const adminEmail = 'admin@example.test';
test('unauthenticated requests fail before token verification', async () => {
  const result = await authorizeAdmin(request(), {adminEmail, verifyToken: async () => {throw new Error('must not run');}});
  assert.equal(result.status, 401);
});
test('only a verified matching identity can use paid admin routes', async () => {
  for (const [identity, status] of [[{email: adminEmail, email_verified: true}, undefined], [{email: adminEmail, email_verified: false}, 403], [{email: 'other@example.test', email_verified: true}, 403]]) {
    const result = await authorizeAdmin(request('token'), {adminEmail, verifyToken: async () => identity});
    assert.equal(result?.status, status);
  }
});
test('bad tokens and missing admin configuration fail closed', async () => {
  assert.equal((await authorizeAdmin(request('bad'), {adminEmail, verifyToken: async () => {throw new Error('expired');}})).status, 401);
  assert.equal((await authorizeAdmin(request('token'), {verifyToken: async () => ({})})).status, 503);
});
