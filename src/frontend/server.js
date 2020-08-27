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
const routers = require(`./router`);
const {
  errorsMiddleware,
  getUserMiddleware,
} = require(`./utils/utils`);
const {
  store,
  userSessionsMiddleware,
} = require(`./session-store`);
require(`../../config/localization.setup`);
require(`dayjs/locale/ru`);

dayjs.locale(DAYJS_DEFAULT_LOCALE);

const log = createLogger(LoggerNames.FRONTEND);
const logApi = createLogger(LoggerNames.FRONTEND_API);

const DEFAULT_PORT = process.env.FRONTEND_PORT;

const app = express();

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
  logApi.debug(`${method} ${url}`);
  next();
});

Object.entries(routers).forEach(([key, router]) => app.use(key, router));

app.use((req, res, next) => {
  next(new CustomError(HttpCodes.NOT_FOUND, _f(`NO_ROUTE_IN_APP`)));
});

app.use(errorsMiddleware(logApi));

app.listen(DEFAULT_PORT, (error) => {
  if (error) {
    log.error(error);
  } else {
    log.info(_f(`SERVER_RUNNING`, {port: DEFAULT_PORT}));
  }
});
