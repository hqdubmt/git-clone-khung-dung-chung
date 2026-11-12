const { rateLimit } = require('express-rate-limit');
const { ErrorResponse } = require('express-error-kit');

const apiRateLimit = (options = {}) => rateLimit({
  windowMs: options.windowMs ?? 15 * 60 * 1000,
  limit: options.limit ?? 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => new ErrorResponse({
    status: 429,
    code: 'TOO_MANY_REQUESTS',
    message: 'Too many requests, please try again later.'
  }).send(res)
});

module.exports = apiRateLimit;
