'use strict';

const axios = require(`../axios`);
const csrfProtection = require(`csurf`);
const {
  commonErrorsHandler,
  CustomError,
  catchAsync,
} = require(`../../utils/utils`);
const {
  HttpCodes,
  UsersRoles,
} = require(`../../../config/constants`);

const sendError = (res, next, error) => {
  return res
    .status(error.statusCode)
    .render(`pages/errors/error`, {error});
};

const errorsHandler = (log) => (error, req, res, next) => {
  return commonErrorsHandler(log)(error, req, res, next, sendError);
};

const auth = (req, res, next) => {
  const {session, cookies} = req;
  if (session.uid && cookies.sid) {
    return next();
  } else {
    throw new CustomError(HttpCodes.UNAUTHORIZED, _f(`USER_NOT_AUTHORIZED`));
  }
};

const admin = (req, res, next) => {
  const {locals} = res;
  if (locals.currentUser) {
    const isAdmin = locals.currentUser.role === UsersRoles.ADMIN;
    if (!isAdmin) {
      throw new CustomError(HttpCodes.FORBIDDEN, _f(`USER_IS_NOT_ADMIN`));
    }
  }
  return next();
};

const getUser = catchAsync(async (req, res, next) => {
  if (req.path !== `/logout`) {
    const {sessionID, sessionStore} = req;
    res.locals.currentUser = {};
    const SessionModel = sessionStore.sessionModel.sequelize.models.Session;
    const sessionData = await SessionModel.findByPk(sessionID);
    if (sessionData) {
      const {uid} = JSON.parse(sessionData.data);
      const {data: userData} = await axios.get(`/users/${uid}`);
      res.locals.currentUser = userData;
    }
  }
  return next();
});

const csrf = csrfProtection({cookie: true});

module.exports = {
  errorsHandler,
  auth,
  getUser,
  admin,
  csrf,
};
