const { BadRequestError } = require('../cors/reasonPhrases.cors');

const validateRegisterUser = (req, res, next) => {
  const body = req.body;

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return next(new BadRequestError('Request body must be a JSON object'));
  }

  const errors = [];
  if (typeof body.name !== 'string' || !body.name.trim()) {
    errors.push('name is required');
  }
  if (
    typeof body.email !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())
  ) {
    errors.push('email must be valid');
  }
  if (typeof body.password !== 'string' || body.password.length < 8) {
    errors.push('password must be at least 8 characters');
  }

  if (errors.length) {
    return next(new BadRequestError(errors.join('; ')));
  }

  return next();
};

module.exports = validateRegisterUser;
