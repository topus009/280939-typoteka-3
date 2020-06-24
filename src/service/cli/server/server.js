'use strict';

const express = require(`express`);
const bodyParser = require(`body-parser`);
const {HttpCodes, BACKEND_API_PREFIX} = require(`../../../config/constants`);
const {Err} = require(`../../../utils/utils`);
const logger = require(`../../../utils/logger`);
const router = require(`./router`);
const api = require(`./api`);
require(`../../../../setup/localization.setup`);

const DEFAULT_PORT = process.env.BACKEND_API_PORT;

const startApp = async (port) => {
  const app = express();

  app.use(express.json());
  app.use(bodyParser.urlencoded({extended: false}));

  const connectedApi = await api();

  Object.entries(router).forEach(([key, _router]) => {
    app.use(`${BACKEND_API_PREFIX}/${key}`, _router(connectedApi));
  });

  app.use((req, res, next) => {
    next(new Err(HttpCodes.NOT_FOUND, _f(`NO_ROUTE_IN_API`)));
  });

  app.use((error, req, res, next) => {
    logger.error(error.text);
    res.status(error.statusCode).json(error);
    next(error);
  });

  app.listen(port, () => {
    logger.success(`Сервер запущен на порту ${port}`);
  });
};

const run = () => {
  startApp(DEFAULT_PORT);
};

module.exports = {
  name: `--server`,
  run
};

// run([]); // для отладки
