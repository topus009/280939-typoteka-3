'use strict';

const csurf = require(`csurf`);
const {
  HttpCodes,
  UsersRoles,
  SESSION_COOKIE_NAME,
  SESSION_UID,
} = require(`../../../config/constants`);
const {
  useCommonErrorsHandler,
  CustomError,
  catchAsync,
} = require(`../../utils/utils`);
const axios = require(`../axios`);

const sendError = (res, next, error) => {
  res
    .status(error.statusCode)
    .render(`pages/errors/error`, {error});
  return;
};

const errorsMiddleware = (log) => (error, req, res, next) => {
  return useCommonErrorsHandler(log)(error, req, res, next, sendError);
};

const authMiddleware = (req, res, next) => {
  const {session, cookies} = req;
  if (session[SESSION_UID] && cookies[SESSION_COOKIE_NAME]) {
    return next();
  }
  throw new CustomError(HttpCodes.UNAUTHORIZED, _f(`USER_NOT_AUTHORIZED`));
};

const adminMiddleware = (req, res, next) => {
  const {locals} = res;
  if (locals.currentUser && locals.currentUser.role !== UsersRoles.ADMIN) {
    throw new CustomError(HttpCodes.FORBIDDEN, _f(`USER_IS_NOT_ADMIN`));
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

module.exports = {
  errorsMiddleware,
  authMiddleware,
  getUserMiddleware,
  adminMiddleware,
  csrfMiddleware,
};
