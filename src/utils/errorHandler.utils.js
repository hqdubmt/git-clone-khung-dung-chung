const { ErrorReponser } = require('../cors/errorReponser.cors');

const errorHandlerUtils = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const normalizedError = error instanceof Error
    ? error
    : error && typeof error === 'object'
      ? Object.assign(new Error(error.message || 'Unknown error'), error)
      : new Error(String(error || 'Unknown error'));
  const status = Number.isInteger(normalizedError.status) && normalizedError.status >= 400 && normalizedError.status <= 599
    ? normalizedError.status
    : Number.isInteger(normalizedError.statusCode) && normalizedError.statusCode >= 400 && normalizedError.statusCode <= 599
      ? normalizedError.statusCode
      : 500;
  const isServerError = status >= 500;
  const fallbackCodes = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    422: 'UNPROCESSABLE_ENTITY',
    429: 'TOO_MANY_REQUESTS'
  };

  if (isServerError) {
    console.error(normalizedError);
  }

  return new ErrorReponser({
    status,
    code: typeof normalizedError.code === 'string' && normalizedError.code.trim()
      ? normalizedError.code
      : fallbackCodes[status] || 'INTERNAL_SERVER_ERROR',
    message: isServerError
      ? 'Internal Server Error'
      : normalizedError.message || 'Bad Request'
  }).send(res);
};

module.exports = errorHandlerUtils;
