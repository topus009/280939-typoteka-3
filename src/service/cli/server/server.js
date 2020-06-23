'use strict';

const express = require(`express`);
const bodyParser = require(`body-parser`);
const {HttpCodes, BACKEND_API_PREFIX} = require(`../../../config/constants`);
const logger = require(`../../../utils/logger`);
const router = require(`./router`);
const api = require(`./api`);

const DEFAULT_PORT = process.env.BACKEND_API_PORT;

const startApp = async (port) => {
  const app = express();

  app.use(express.json());
  app.use(bodyParser.urlencoded({extended: false}));

  const connectedApi = await api();

  Object.entries(router).forEach(([key, _router]) => {
    app.use(`${BACKEND_API_PREFIX}/${key}`, _router(connectedApi));
  });

  app.use((err, req, res, next) => {
    logger.error(err.message);
    res.status(HttpCodes.INTERNAL_SERVER_ERROR);
    next(err);
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
