const { once } = require('node:events');

function setupTestServer({ before, after }, app) {
    let server;
    let baseUrl;

    before(async () => {
        server = app.listen(0, '127.0.0.1');

        await once(server, 'listening');

        baseUrl = `http://127.0.0.1:${server.address().port}`;
    });

    after(async () => {
        if (server) {
            await new Promise((resolve, reject) => {
                server.close((error) => {
                    if (error) reject(error);
                    else resolve();
                });
            });
        }
    });

    return {
        get baseUrl() {
            return baseUrl;
        }
    };
}

module.exports = setupTestServer;