const crypto = require('node:crypto');
const {
  InternalServerError,
  UnauthorizedError
} = require('../cors/reasonPhrases.cors');

const decodeSegment = (segment) => {
  if (!/^[A-Za-z0-9_-]+$/.test(segment)) {
    throw new UnauthorizedError('Invalid or expired token');
  }

  try {
    return JSON.parse(Buffer.from(segment, 'base64url').toString('utf8'));
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
};

const authenticate = (req, res, next) => {
  const authorization = req.get('authorization');
  const match = typeof authorization === 'string'
    ? authorization.match(/^Bearer ([^\s]+)$/i)
    : null;

  if (!match) {
    return next(new UnauthorizedError('Bearer token is required'));
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next(new InternalServerError('JWT_SECRET is not configured'));
  }

  const parts = match[1].split('.');
  if (parts.length !== 3 || parts.some((part) => !part)) {
    return next(new UnauthorizedError('Invalid or expired token'));
  }

  try {
    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const header = decodeSegment(encodedHeader);
    const payload = decodeSegment(encodedPayload);

    if (
      !header ||
      typeof header !== 'object' ||
      Array.isArray(header) ||
      header.alg !== 'HS256' ||
      !payload ||
      typeof payload !== 'object' ||
      Array.isArray(payload) ||
      !Number.isFinite(payload.exp) ||
      payload.exp <= Math.floor(Date.now() / 1000) ||
      (payload.nbf !== undefined &&
        (!Number.isFinite(payload.nbf) || payload.nbf > Math.floor(Date.now() / 1000)))
    ) {
      return next(new UnauthorizedError('Invalid or expired token'));
    }

    if (!/^[A-Za-z0-9_-]+$/.test(encodedSignature)) {
      return next(new UnauthorizedError('Invalid or expired token'));
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest();
    const actualSignature = Buffer.from(encodedSignature, 'base64url');

    if (
      actualSignature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(actualSignature, expectedSignature)
    ) {
      return next(new UnauthorizedError('Invalid or expired token'));
    }

    req.user = payload;
    return next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return next(error);
    }
    return next(error);
  }
};

module.exports = authenticate;
