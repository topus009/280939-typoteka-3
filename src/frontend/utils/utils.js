'use strict';

const csurf = require(`csurf`);
const {
  HttpCodes,
  UsersRoles,
  SESSION_COOKIE_NAME,
  SESSION_UID,
  LoggerNames,
} = require(`../../../config/constants`);
const {
  useCommonErrorsHandler,
  CustomError,
  catchAsync,
} = require(`../../utils/utils`);
const {createLogger} = require(`../../utils/logger`);
const fm = require(`../../utils/localization`);
const axios = require(`../axios`);

const log = createLogger(LoggerNames.SOCKET);

const sendError = (res, next, error) => {
  res
    .status(error.statusCode)
    .render(`pages/errors/error`, {error});
  return;
};

const errorsMiddleware = (logger) => (error, req, res, next) => {
  return useCommonErrorsHandler(logger)(error, req, res, next, sendError);
};

const authMiddleware = (req, res, next) => {
  const {session, cookies} = req;
  if (session[SESSION_UID] && cookies[SESSION_COOKIE_NAME]) {
    return next();
  }
  throw new CustomError(HttpCodes.UNAUTHORIZED, fm(`USER_NOT_AUTHORIZED`));
};

const adminMiddleware = (req, res, next) => {
  const {locals} = res;
  if (locals.currentUser && locals.currentUser.role !== UsersRoles.ADMIN) {
    throw new CustomError(HttpCodes.FORBIDDEN, fm(`USER_IS_NOT_ADMIN`));
  }
  return next();
};

const getUserMiddleware = catchAsync(async (req, res, next) => {
  if (req.path !== `/logout`) {
    const {sessionID, sessionStore} = req;
    res.locals.currentUser = {};
    const SessionModel = sessionStore.sessionModel.sequelize.models.Session;
    const sessionData = await SessionModel.findByPk(sessionID);
    if (sessionData) {
      const {[SESSION_UID]: uid} = JSON.parse(sessionData.data);
      const {data: userData} = await axios.get(`/users/${uid}`);
      res.locals.currentUser = userData;
    }
  }
  return next();
});

const csrfMiddleware = csurf({cookie: true});

const appRunningMiddleware = (err, port, logger) => {
  if (err) {
    logger.error(err);
  } else {
    logger.info(fm(`SERVER_RUNNING`, {port}));
  }
};

const countMainPageUsersMiddleware = (req, res, next) => {
  const io = req.app.get(`io`);
  io.on(`connect`, (socket) => {
    log.debug(fm(`SOCKET_USER_CONNECTED`, {id: socket.id}));
    io.emit(`MAIN_PAGE_READERS_COUNT`, io.engine.clientsCount);

    socket.on(`disconnect`, () => {
      log.debug(fm(`SOCKET_USER_DISCONNECTED`, {id: socket.id}));
      io.emit(`MAIN_PAGE_READERS_COUNT`, io.engine.clientsCount);
    });
  });
  return next();
};

module.exports = {
  errorsMiddleware,
  authMiddleware,
  getUserMiddleware,
  adminMiddleware,
  csrfMiddleware,
  appRunningMiddleware,
  countMainPageUsersMiddleware,
};
