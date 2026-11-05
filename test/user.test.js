const { before, after, test } = require('node:test');
const assert = require('node:assert/strict');

const app = require('../src/app');
const setupTestServer = require('./helpers/testServer');

const server = setupTestServer({ before, after }, app);

// GET - Lấy danh sách User
test('Lấy danh sách User thành công', async () => {
    const response = await fetch(`${server.baseUrl}/api/v1/users`);

    assert.equal(response.status, 200);
});

// GET - Lấy User theo ID
test('Lấy User theo ID', async () => {
    const response = await fetch(`${server.baseUrl}/api/v1/users/1`);

    assert.ok([200, 404].includes(response.status));
});

// POST - Tạo User
test('Tạo User mới', async () => {
    const response = await fetch(`${server.baseUrl}/api/v1/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: 'Test User',
            email: `test-${Date.now()}@example.com`,
            password: 'Test123456'
        })
    });

    assert.ok([200, 201].includes(response.status));
});

// PUT - Cập nhật User
test('Cập nhật User', async () => {
    const response = await fetch(`${server.baseUrl}/api/v1/users/1`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: 'Updated User'
        })
    });

    assert.ok([200, 404].includes(response.status));
});

// DELETE - Xóa User
test('Xóa User', async () => {
    const response = await fetch(`${server.baseUrl}/api/v1/users/1`, {
        method: 'DELETE'
    });

    assert.ok([200, 204, 404].includes(response.status));
});