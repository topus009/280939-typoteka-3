'use strict';

const express = require(`express`);

const cookieParser = require(`cookie-parser`);
const bodyParser = require(`body-parser`);
const {
  HttpCodes,
  DAYJS_DEFAULT_LOCALE,
  EXPRESS_PATH_TO_PUBLIC,
  EXPRESS_PATH_TO_TEMPLATES,
  LoggerNames,
} = require(`../../config/constants`);
const dayjs = require(`../utils/dayjs`);
const {CustomError} = require(`../utils/utils`);
const {createLogger} = require(`../utils/logger`);
const fm = require(`../utils/localization`);
const routers = require(`./router`);
const {createSocketServer} = require(`./socket/socket`);
const {
  errorsMiddleware,
  getUserMiddleware,
  appRunningMiddleware,
} = require(`./utils/utils`);
const {
  store,
  userSessionsMiddleware,
} = require(`./session-store`);
require(`dayjs/locale/ru`);

dayjs.locale(DAYJS_DEFAULT_LOCALE);

const log = createLogger(LoggerNames.FRONTEND);
const logApi = createLogger(LoggerNames.FRONTEND_API);

const DEFAULT_PORT = process.env.FRONTEND_PORT;

const app = express();

const server = app.listen(DEFAULT_PORT, (err) => {
  appRunningMiddleware(err, DEFAULT_PORT, log);
});

const io = createSocketServer(server);

app.set(`io`, io);

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(userSessionsMiddleware);
store.sync();
app.use(getUserMiddleware);

app.set(`views`, EXPRESS_PATH_TO_TEMPLATES);
app.set(`view engine`, `pug`);

app.use(express.static(EXPRESS_PATH_TO_PUBLIC));

app.use((req, res, next) => {
  const {method, url} = req;
  res.locals.path = req.path;
  res.locals.NODE_ENV = process.env.NODE_ENV;
  logApi.debug(`${method} ${url}`);
  next();
});

Object.entries(routers).forEach(([key, router]) => app.use(key, router));

app.use((req, res, next) => {
  next(new CustomError(HttpCodes.NOT_FOUND, fm(`NO_ROUTE_IN_APP`)));
});

app.use(errorsMiddleware(logApi));
