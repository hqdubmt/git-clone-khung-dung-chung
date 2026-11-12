# express-error-kit

Reusable HTTP errors and Express middleware for Node.js 18+ projects. The package
has no runtime dependencies.

## Install

During local development, copy this directory into the other project and run:

```sh
npm install ./packages/express-error-kit
```

After publishing the package to npm or a private registry, install it by name:

```sh
npm install express-error-kit
```

The unscoped name may already be registered on npm; choose an available name
before publishing.

## Usage

```js
const express = require('express');
const {
  BadRequestError,
  NotFoundError,
  asyncHandler,
  errorHandler
} = require('express-error-kit');

const app = express();

app.get('/items/:id', asyncHandler(async (req, res) => {
  const item = await findItem(req.params.id);
  if (!item) {
    throw new NotFoundError('Item not found');
  }
  res.json(item);
}));

app.post('/items', (req, res, next) => {
  if (!req.body.name) {
    return next(new BadRequestError('Name is required'));
  }
  res.sendStatus(201);
});

// Register after routes and any not-found middleware.
app.use(errorHandler);
```

Error responses have a stable structure:

```json
{
  "status": 400,
  "code": "BAD_REQUEST",
  "message": "Name is required",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

By default, 5xx responses hide internal error messages and details; the original
error is logged on the server. `createErrorHandler()` can customize logging,
public messages, and whether non-sensitive 4xx `details` are included.

## Available errors

`HttpError` accepts `(status, code, message, details)`. Convenience classes are
available for 400, 401, 403, 404, 409, 422, 429, 500, 502 and 503:
`BadRequestError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`,
`ConflictError`, `UnprocessableEntityError`, `TooManyRequestsError`,
`InternalServerError`, `BadGatewayError`, and `ServiceUnavailableError`.

The package also exports `ErrorResponse`, `createErrorHandler`, `errorHandler`,
and `asyncHandler`.
