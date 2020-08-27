'use strict';

const {Router} = require(`express`);
const {
  HttpCodes,
  SESSION_COOKIE_NAME,
  SESSION_UID,
} = require(`../../../config/constants`);
const {userImgUploadMiddleware} = require(`../../utils/upload`);
const {catchAsync} = require(`../../utils/utils`);
const axios = require(`../axios`);
const {csrfMiddleware} = require(`../utils/utils`);

const registerRouter = new Router();
const loginRouter = new Router();
const logoutRouter = new Router();

registerRouter.get(`/`, [
  csrfMiddleware,
], (req, res) => {
  res.render(`pages/auth/registration`, {csrf: req.csrfToken()});
  return;
});

registerRouter.post(`/`, [
  userImgUploadMiddleware,
  csrfMiddleware,
], async (req, res, next) => {
  try {
    const data = req.body;
    if (req.file) {
      data.file = req.file;
    }
    const registerData = await axios.post(`/users/auth/register`, data);
    if (registerData.status === HttpCodes.OK) {
      res.redirect(`/login`);
    }
    return;
  } catch (error) {
    if (error.statusCode === HttpCodes.BAD_REQUEST && Array.isArray(error.text)) {
      res.render(`pages/auth/registration`, {
        errors: error.text,
        csrf: req.csrfToken(),
      });
      return;
    }
    next(error);
  }
});

loginRouter.get(`/`, [
  csrfMiddleware,
], (req, res) => {
  res.render(`pages/auth/login`, {csrf: req.csrfToken()});
  return;
});

loginRouter.post(`/`, [
  csrfMiddleware,
], catchAsync(async (req, res) => {
  const {data} = await axios.post(`/users/auth/login`, req.body);
  if (data) {
    const {data: userData} = await axios.get(`/users/${data}`);
    res.locals.currentUser = userData;
    req.session[SESSION_UID] = data;
  }
  req.session.save(() => res.redirect(`/`));
  return;
}));

logoutRouter.get(`/`, (req, res) => {
  res.clearCookie(SESSION_COOKIE_NAME);
  res.redirect(`/login`);
  return;
});

module.exports = {
  registerRouter,
  loginRouter,
  logoutRouter,
};
