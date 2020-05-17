'use strict';

const express = require(`express`);
const routers = require(`./router`);

const DEFAULT_PORT = 8080;

const app = express();

app.listen(DEFAULT_PORT, () => {
  console.log(`"Сервер запущен на порту: ${DEFAULT_PORT}`);
});

Object.keys(routers).forEach((key) => {
  app.use(key, routers[key]);
});
