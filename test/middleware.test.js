const { before, after, test } = require('node:test');
const assert = require('node:assert/strict');

process.env.CORS_ORIGINS = 'https://allowed.example';
process.env.RATE_LIMIT_MAX = '3';

const app = require('../src/app');
const setupTestServer = require('./helpers/testServer');

const server = setupTestServer({ before, after }, app);

test('CORS only allows configured origins and API rate limit is configurable', async () => {
  const disallowedResponse = await fetch(`${server.baseUrl}/api/v1/health`, {
    headers: { Origin: 'https://other.example' }
  });
  assert.equal(disallowedResponse.headers.get('access-control-allow-origin'), null);

  const allowedResponse = await fetch(`${server.baseUrl}/api/v1/health`, {
    headers: { Origin: 'https://allowed.example' }
  });
  assert.equal(
    allowedResponse.headers.get('access-control-allow-origin'),
    'https://allowed.example'
  );

  const secondAllowedResponse = await fetch(`${server.baseUrl}/api/v1/health`, {
    headers: { Origin: 'https://allowed.example' }
  });
  assert.equal(secondAllowedResponse.status, 200);

  const rateLimitedResponse = await fetch(`${server.baseUrl}/api/v1/health`, {
    headers: { Origin: 'https://allowed.example' }
  });
  const errorBody = await rateLimitedResponse.json();
  assert.equal(rateLimitedResponse.status, 429);
  assert.equal(errorBody.code, 'TOO_MANY_REQUESTS');
});
