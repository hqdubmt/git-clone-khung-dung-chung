const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
  HttpError,
  ErrorResponse,
  createErrorHandler,
  asyncHandler,
  errorHandler
} = require('express-error-kit');

const createResponse = () => ({
  statusCode: null,
  body: null,
  status(statusCode) {
    this.statusCode = statusCode;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  }
});

test('HTTP errors preserve status, code, message, and optional details', () => {
  const error = new BadRequestError('Invalid input', { field: 'email' });
  assert.equal(error.status, 400);
  assert.equal(error.code, 'BAD_REQUEST');
  assert.equal(error.message, 'Invalid input');
  assert.deepEqual(error.details, { field: 'email' });
  assert.equal(error instanceof HttpError, true);
  assert.equal(new NotFoundError().status, 404);
});

test('error response sends a timestamped JSON response', () => {
  const res = createResponse();
  new ErrorResponse({ status: 404, code: 'NOT_FOUND', message: 'Missing' }).send(res);

  assert.equal(res.statusCode, 404);
  assert.equal(res.body.code, 'NOT_FOUND');
  assert.equal(res.body.message, 'Missing');
  assert.equal(Number.isNaN(Date.parse(res.body.timestamp)), false);
});

test('error handler preserves client error response behavior', () => {
  const res = createResponse();
  errorHandler(new BadRequestError('Invalid input', { field: 'email' }), {}, res, assert.fail);

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.message, 'Invalid input');
  assert.equal('details' in res.body, false);
});

test('configured error handler can expose validation details and custom messages', () => {
  const res = createResponse();
  const handler = createErrorHandler({
    includeDetails: true,
    messages: { 400: 'Please check the form' }
  });
  handler(new BadRequestError('Invalid input', { field: 'email' }), {}, res, assert.fail);

  assert.equal(res.body.message, 'Please check the form');
  assert.deepEqual(res.body.details, { field: 'email' });
});

test('error handler hides server error details', () => {
  const res = createResponse();
  const originalConsoleError = console.error;
  console.error = () => {};
  try {
    errorHandler(new InternalServerError('Database password leaked', { secret: 'hidden' }), {}, res, assert.fail);
  } finally {
    console.error = originalConsoleError;
  }

  assert.equal(res.statusCode, 500);
  assert.equal(res.body.message, 'Internal Server Error');
  assert.equal('details' in res.body, false);
});

test('error handler delegates when response headers have been sent', () => {
  const error = new Error('Already sent');
  const res = { headersSent: true };
  errorHandler(error, {}, res, (passedError) => assert.equal(passedError, error));
});

test('async handler forwards rejected promises to next', async () => {
  const error = new Error('Rejected');
  let forwarded;
  await asyncHandler(async () => {
    throw error;
  })({}, {}, (received) => {
    forwarded = received;
  });

  assert.equal(forwarded, error);
});
