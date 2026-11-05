const { before, after, test } = require('node:test');
const assert = require('node:assert/strict');

const app = require('../src/app');
const setupTestServer = require('./helpers/testServer');

const server = setupTestServer({ before, after }, app);

test('Từ chối email không hợp lệ', async () => {
    const response = await fetch(
        `${server.baseUrl}/api/v1/auth/register/user`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Test User',
                email: 'abc',
                password: '12345678'
            })
        }
    );

    assert.equal(response.status, 400);
});

test('Từ chối mật khẩu dưới 8 ký tự', async () => {
    const response = await fetch(
        `${server.baseUrl}/api/v1/auth/register/user`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Test User',
                email: 'test@example.com',
                password: '123'
            })
        }
    );

    assert.equal(response.status, 400);
});

test('Từ chối dữ liệu đăng ký rỗng', async () => {
    const response = await fetch(
        `${server.baseUrl}/api/v1/auth/register/user`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        }
    );

    assert.equal(response.status, 400);
});