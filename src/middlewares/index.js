const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const apiRateLimit = require('./apiRateLimit.middleware');

const configureMiddlewares = (app, config) => {
  app.use(cors());
  app.use(helmet());
  app.use(morgan(config.LOG_FORMAT));
  app.use(compression());
  app.use('/api', apiRateLimit);
  app.use(express.json());
  app.use(cookieParser());
};

module.exports = configureMiddlewares;
