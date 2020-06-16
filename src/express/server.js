'use strict';

const express = require(`express`);
const dayjs = require(`dayjs`);
const path = require(`path`);
const {HttpCodes} = require(`../config/constants`);
const logger = require(`../utils/logger`);
const routers = require(`./router`);

require(`dayjs/locale/ru`);
dayjs.locale(`ru`);

const DEFAULT_PORT = process.env.PORT || 8080;

const app = express();

app.set(`views`, path.join(__dirname, `./templates`));
app.set(`view engine`, `pug`);

app.use(express.static(path.resolve(__dirname, `public`)));

Object.entries(routers).forEach(([key, router]) => app.use(key, router));

app.use((err, req, res, next) => {
  logger.error(err.message);
  res
    .status(HttpCodes.HTTP_SERVER_ERROR_CODE)
    .render(`pages/error/${HttpCodes.HTTP_SERVER_ERROR_CODE}`);
  next(err);
});

app.listen(DEFAULT_PORT, () => {
  logger.success(`Сервер запущен на порту: ${DEFAULT_PORT}`);
});