'use strict';

const express = require(`express`);
const bodyParser = require(`body-parser`);
const {HttpCodes, BACKEND_API_PREFIX} = require(`../../../config/constants`);
const {CustomError} = require(`../../../utils/utils`);
const {createLogger, LoggerNames} = require(`../../../utils/logger`);
const router = require(`./router`);
const api = require(`./api`);
require(`../../../../setup/localization.setup`);

const log = createLogger(LoggerNames.BACKEND);
const logApi = createLogger(LoggerNames.BACKEND_API);

const DEFAULT_PORT = process.env.BACKEND_API_PORT;

const createServer = async () => {
  const app = express();

  app.use(express.json());
  app.use(bodyParser.urlencoded({extended: false}));

  const connectedApi = await api();

  app.use((req, res, next) => {
    const {method, url} = req;
    logApi.debug(`${method} ${url}`);
    next();
  });

  Object.entries(router).forEach(([key, _router]) => {
    app.use(`${BACKEND_API_PREFIX}/${key}`, _router(connectedApi));
  });

  app.use((req, res, next) => {
    next(new CustomError(HttpCodes.NOT_FOUND, _f(`NO_ROUTE_IN_API`)));
  });

  app.use((error, req, res, next) => {
    const {text, statusCode} = error;
    const {method, url} = req;

    const formattedText = Array.isArray(text) ? JSON.stringify(text) : text;

    logApi.error(`${method} ${url} - statusCode - ${statusCode}, text - ${formattedText}`);
    res
      .status(statusCode)
      .json(error);
    next(error);
  });

  return app;
};

const run = async () => {
  const server = await createServer();
  server.listen(DEFAULT_PORT, (error) => {
    if (error) {
      log.error(error);
    } else {
      log.info(`Server running on port: ${DEFAULT_PORT}`);
    }
  });
};

module.exports = {
  name: `--server`,
  run,
  createServer,
};

// run(); // for debugging
