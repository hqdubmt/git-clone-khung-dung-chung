const { before, after, test } = require('node:test');
const assert = require('node:assert/strict');

const app = require('../src/app');
const setupTestServer = require('./helpers/testServer');

const server = setupTestServer({ before, after }, app);

test('Health API phải trả về OK', async () => {
    const response = await fetch(`${server.baseUrl}/api/v1`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.status, 'OK');
});