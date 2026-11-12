const { test } = require('node:test');
const assert = require('node:assert/strict');

const configPath = require.resolve('../src/configs/app.config');

const loadConfig = (environment, port, platformPort) => {
  if (environment === undefined) {
    delete process.env.APP_ENV;
  } else {
    process.env.APP_ENV = environment;
  }
  if (port === undefined) {
    delete process.env.APP_PORT;
  } else {
    process.env.APP_PORT = port;
  }
  if (platformPort === undefined) {
    delete process.env.PORT;
  } else {
    process.env.PORT = platformPort;
  }
  delete require.cache[configPath];
  return require(configPath);
};

test('environment config applies defaults and parses the port as a number', () => {
  const originalEnvironment = process.env.APP_ENV;
  const originalPort = process.env.APP_PORT;
  const originalPlatformPort = process.env.PORT;
  const originalCorsOrigins = process.env.CORS_ORIGINS;
  const originalRateWindow = process.env.RATE_LIMIT_WINDOW_MS;
  const originalRateMax = process.env.RATE_LIMIT_MAX;
  try {
    const devConfig = loadConfig(undefined, undefined);
    assert.equal(devConfig.ENV, 'Dev');
    assert.equal(devConfig.PORT, 5001);
    assert.equal(typeof devConfig.PORT, 'number');

    const prodConfig = loadConfig('Prod', undefined);
    assert.equal(prodConfig.ENV, 'Prod');
    assert.equal(prodConfig.PORT, 8080);

    const customPortConfig = loadConfig('Dev', '4321');
    assert.equal(customPortConfig.PORT, 4321);
    assert.equal(loadConfig('Prod', undefined, '7000').PORT, 7000);
    assert.equal(loadConfig('Dev', '4321', '7000').PORT, 4321);
    process.env.CORS_ORIGINS = 'http://localhost:3000, https://example.com ';
    process.env.RATE_LIMIT_WINDOW_MS = '60000';
    process.env.RATE_LIMIT_MAX = '25';
    delete require.cache[configPath];
    const customConfig = require(configPath);
    assert.deepEqual(customConfig.CORS_ORIGINS, [
      'http://localhost:3000',
      'https://example.com'
    ]);
    assert.equal(customConfig.RATE_LIMIT_WINDOW_MS, 60000);
    assert.equal(customConfig.RATE_LIMIT_MAX, 25);
  } finally {
    if (originalEnvironment === undefined) {
      delete process.env.APP_ENV;
    } else {
      process.env.APP_ENV = originalEnvironment;
    }
    if (originalPort === undefined) {
      delete process.env.APP_PORT;
    } else {
      process.env.APP_PORT = originalPort;
    }
    if (originalPlatformPort === undefined) {
      delete process.env.PORT;
    } else {
      process.env.PORT = originalPlatformPort;
    }
    for (const [name, value] of [
      ['CORS_ORIGINS', originalCorsOrigins],
      ['RATE_LIMIT_WINDOW_MS', originalRateWindow],
      ['RATE_LIMIT_MAX', originalRateMax]
    ]) {
      if (value === undefined) {
        delete process.env[name];
      } else {
        process.env[name] = value;
      }
    }
    delete require.cache[configPath];
  }
});

test('environment config rejects unknown environments and invalid ports', () => {
  const originalEnvironment = process.env.APP_ENV;
  const originalPort = process.env.APP_PORT;
  const originalPlatformPort = process.env.PORT;
  const originalRateWindow = process.env.RATE_LIMIT_WINDOW_MS;
  const originalRateMax = process.env.RATE_LIMIT_MAX;
  try {
    assert.throws(() => loadConfig('test', undefined), /APP_ENV must be either/);
    assert.throws(() => loadConfig('Dev', 'not-a-port'), /APP_PORT must be a positive integer/);
    assert.throws(() => loadConfig('Dev', '65536'), /APP_PORT must be between/);
    process.env.RATE_LIMIT_MAX = '0';
    assert.throws(() => loadConfig('Dev', '5001'), /RATE_LIMIT_MAX must be between/);
  } finally {
    if (originalEnvironment === undefined) {
      delete process.env.APP_ENV;
    } else {
      process.env.APP_ENV = originalEnvironment;
    }
    if (originalPort === undefined) {
      delete process.env.APP_PORT;
    } else {
      process.env.APP_PORT = originalPort;
    }
    if (originalPlatformPort === undefined) {
      delete process.env.PORT;
    } else {
      process.env.PORT = originalPlatformPort;
    }
    for (const [name, value] of [
      ['RATE_LIMIT_WINDOW_MS', originalRateWindow],
      ['RATE_LIMIT_MAX', originalRateMax]
    ]) {
      if (value === undefined) {
        delete process.env[name];
      } else {
        process.env[name] = value;
      }
    }
    delete require.cache[configPath];
  }
});
