'use strict';

const express = require(`express`);
const logger = require(`../../../utils/logger`);
const routers = require(`./router`);
const {
  parseCommandParam,
} = require(`../../../utils/utils`);

const DEFAULT_PORT = process.env.PORT || 3000;

const startApp = (port) => {
  const app = express();

  app.use(express.json());

  Object.entries(routers).forEach(([key, router]) => app.use(key, router));

  app.use((err, req, res, next) => {
    logger.error(err.message);
    res.status(500);
    next(err);
  });

  app.listen(port, () => {
    logger.success(`Сервер запущен на порту ${port}`);
  });
};

const run = (input) => {
  let port = DEFAULT_PORT;
  const userPort = parseCommandParam(input);
  if (!isNaN(userPort)) {
    port = userPort;
  }
  startApp(port);
};

module.exports = {
  name: `--server`,
  run
};

// run([3000]); // для отладки
