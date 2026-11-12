const { before, after, test } = require('node:test');
const assert = require('node:assert/strict');

const app = require('../src/app');
const setupTestServer = require('./helpers/testServer');

const server = setupTestServer({ before, after }, app);

test('Health API phải trả về OK', async () => {
    const response = await fetch(`${server.baseUrl}/api/v1/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.status, 'OK');
    assert.equal(Number.isNaN(Date.parse(body.timestamp)), false);
});

test('Unknown API routes return a consistent not-found response', async () => {
    const response = await fetch(`${server.baseUrl}/api/v1/unknown`);
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.equal(body.code, 'NOT_FOUND');
});