const { rateLimit } = require('express-rate-limit');
const { ErrorReponser } = require('../cors/errorReponser.cors');

const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => new ErrorReponser({
    status: 429,
    code: 'TOO_MANY_REQUESTS',
    message: 'Too many requests, please try again later.'
  }).send(res)
});

module.exports = apiRateLimit;
