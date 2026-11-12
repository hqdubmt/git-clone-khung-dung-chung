const parsePositiveInteger = (name, value, fallback, maximum = Number.MAX_SAFE_INTEGER) => {
  if (value === undefined || value === '') {
    return fallback;
  }

  if (!/^\d+$/.test(String(value).trim())) {
    throw new Error(`${name} must be a positive integer`);
  }

  const parsedValue = Number(value);
  if (!Number.isSafeInteger(parsedValue) || parsedValue < 1 || parsedValue > maximum) {
    throw new Error(`${name} must be between 1 and ${maximum}`);
  }

  return parsedValue;
};

const currentEnv = process.env.APP_ENV || 'Dev';
if (currentEnv !== 'Dev' && currentEnv !== 'Prod') {
  throw new Error('APP_ENV must be either "Dev" or "Prod"');
}

const selectedConfig = {
  ENV: currentEnv,
  PORT: currentEnv === 'Prod' ? 8080 : 5001,
  LOG_FORMAT: currentEnv === 'Prod' ? 'combined' : 'dev'
};
const configuredPort = process.env.APP_PORT || process.env.PORT;
const port = parsePositiveInteger('APP_PORT', configuredPort, selectedConfig.PORT, 65535);
const corsOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

module.exports = {
  ...selectedConfig,
  PORT: port,
  CORS_ORIGINS: corsOrigins,
  RATE_LIMIT_WINDOW_MS: parsePositiveInteger(
    'RATE_LIMIT_WINDOW_MS',
    process.env.RATE_LIMIT_WINDOW_MS,
    15 * 60 * 1000,
    2147483647
  ),
  RATE_LIMIT_MAX: parsePositiveInteger('RATE_LIMIT_MAX', process.env.RATE_LIMIT_MAX, 100)
};
