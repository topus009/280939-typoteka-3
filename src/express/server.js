'use strict';

const express = require(`express`);
const dayjs = require(`dayjs`);
const path = require(`path`);
const {HttpCodes} = require(`../config/constants`);
const {Err} = require(`../utils/utils`);
const logger = require(`../utils/logger`);
const routers = require(`./router`);
require(`../../setup/localization.setup`);

require(`dayjs/locale/ru`);
dayjs.locale(`ru`);

const DEFAULT_PORT = process.env.FRONTEND_PORT;

const app = express();

app.set(`views`, path.join(__dirname, `./templates`));
app.set(`view engine`, `pug`);

app.use(express.static(path.resolve(__dirname, `public`)));

Object.entries(routers).forEach(([key, router]) => app.use(key, router));

app.use((req, res, next) => {
  next(new Err(HttpCodes.NOT_FOUND, _f(`NO_ROUTE_IN_APP`)));
});

app.use((error, req, res, next) => {
  logger.error(error.text);
  res
    .status(error.statusCode)
    .render(`pages/errors/error`, {error});
  next(error);
});

app.listen(DEFAULT_PORT, () => {
  logger.success(`Сервер запущен на порту: ${DEFAULT_PORT}`);
});
