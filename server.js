require('dotenv').config();
const app = require('./src/app');

const config = app.get('config');
const server = app.listen(config.PORT, () => {
  console.log(`API listening at http://localhost:${config.PORT} (${config.ENV})`);
});

let isShuttingDown = false;
const shutdown = (reason, exitCode = 1) => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.error(`Shutting down server: ${reason}`);
  process.exitCode = exitCode;
  server.close((error) => {
    if (error) {
      console.error('Error while closing server:', error);
      process.exitCode = 1;
    }
  });

  const forceExit = setTimeout(() => {
    console.error('Could not close server gracefully; forcing shutdown');
    process.exit(1);
  }, 10_000);
  forceExit.unref();
};

process.once('SIGINT', () => shutdown('SIGINT', 0));
process.once('SIGTERM', () => shutdown('SIGTERM', 0));
process.once('unhandledRejection', (error) => shutdown(error));
process.once('uncaughtException', (error) => shutdown(error));
