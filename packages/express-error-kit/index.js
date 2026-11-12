'use strict';

const DEFAULT_MESSAGES = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  422: 'Unprocessable Entity',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable'
};

const DEFAULT_CODES = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  422: 'UNPROCESSABLE_ENTITY',
  429: 'TOO_MANY_REQUESTS',
  500: 'INTERNAL_SERVER_ERROR',
  502: 'BAD_GATEWAY',
  503: 'SERVICE_UNAVAILABLE'
};

class HttpError extends Error {
  constructor(status, code, message = DEFAULT_MESSAGES[status] || 'Error', details = null) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.code = code;
    this.timestamp = new Date().toISOString();
    this.details = details;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

class BadRequestError extends HttpError {
  constructor(message = DEFAULT_MESSAGES[400], details = null) {
    super(400, 'BAD_REQUEST', message, details);
  }
}

class UnauthorizedError extends HttpError {
  constructor(message = DEFAULT_MESSAGES[401], details = null) {
    super(401, 'UNAUTHORIZED', message, details);
  }
}

class ForbiddenError extends HttpError {
  constructor(message = DEFAULT_MESSAGES[403], details = null) {
    super(403, 'FORBIDDEN', message, details);
  }
}

class NotFoundError extends HttpError {
  constructor(message = DEFAULT_MESSAGES[404], details = null) {
    super(404, 'NOT_FOUND', message, details);
  }
}

class ConflictError extends HttpError {
  constructor(message = DEFAULT_MESSAGES[409], details = null) {
    super(409, 'CONFLICT', message, details);
  }
}

class UnprocessableEntityError extends HttpError {
  constructor(message = DEFAULT_MESSAGES[422], details = null) {
    super(422, 'UNPROCESSABLE_ENTITY', message, details);
  }
}

class TooManyRequestsError extends HttpError {
  constructor(message = DEFAULT_MESSAGES[429], details = null) {
    super(429, 'TOO_MANY_REQUESTS', message, details);
  }
}

class InternalServerError extends HttpError {
  constructor(message = DEFAULT_MESSAGES[500], details = null) {
    super(500, 'INTERNAL_SERVER_ERROR', message, details);
  }
}

class BadGatewayError extends HttpError {
  constructor(message = DEFAULT_MESSAGES[502], details = null) {
    super(502, 'BAD_GATEWAY', message, details);
  }
}

class ServiceUnavailableError extends HttpError {
  constructor(message = DEFAULT_MESSAGES[503], details = null) {
    super(503, 'SERVICE_UNAVAILABLE', message, details);
  }
}

class ErrorResponse {
  constructor({ status, code, message }) {
    this.status = status;
    this.code = code;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }

  send(res) {
    return res.status(this.status).json(this);
  }
}

const createErrorHandler = ({
  logger = console,
  includeDetails = false,
  messages = {}
} = {}) => (error, req, res, next) => {
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

  if (isServerError) {
    logger.error(normalizedError);
  }

  const response = new ErrorResponse({
    status,
    code: typeof normalizedError.code === 'string' && normalizedError.code.trim()
      ? normalizedError.code
      : DEFAULT_CODES[status] || 'INTERNAL_SERVER_ERROR',
    message: messages[status] || (isServerError
      ? 'Internal Server Error'
      : normalizedError.message || DEFAULT_MESSAGES[status] || 'Bad Request')
  });

  if (includeDetails && !isServerError && normalizedError.details != null) {
    response.details = normalizedError.details;
  }

  return response.send(res);
};

const errorHandler = createErrorHandler();

const asyncHandler = (handler) => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  HttpError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  UnprocessableEntityError,
  TooManyRequestsError,
  InternalServerError,
  BadGatewayError,
  ServiceUnavailableError,
  ErrorResponse,
  createErrorHandler,
  errorHandler,
  asyncHandler
};
