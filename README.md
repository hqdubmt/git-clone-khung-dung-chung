# order-foot

## Middleware

The shared Express middleware stack is configured in `src/middlewares/index.js`.
API requests are limited to 100 per 15 minutes. User registration requires a
non-empty `name`, a valid `email`, and a `password` of at least 8 characters.

Protected routes can use the HS256 token authentication middleware:

```js
const authenticate = require('../../../../middlewares/auth.middleware');

router.get('/protected', authenticate, controller.handler);
```

Tokens must use HS256 and include an `exp` claim. Set a strong `JWT_SECRET`
environment variable before starting the server. On success, the decoded token
payload is available as `req.user`.
