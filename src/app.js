const express = require('express');
const { NotFoundError, errorHandler } = require('express-error-kit');
const configureMiddlewares = require('./middlewares');

const finalConfig = require('./configs/app.config');

const app = express();

app.set('config', finalConfig);
configureMiddlewares(app, finalConfig);

const apiRouter = express.Router();
apiRouter.use('/v1', require('./app/v1/routers'));
app.use('/api', apiRouter);

app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
});
app.use(errorHandler);

module.exports = app;
