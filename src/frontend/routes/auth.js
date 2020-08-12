'use strict';

const {Router} = require(`express`);
const axios = require(`../axios`);
const {userImgUpload} = require(`../../utils/upload`);
const {catchAsync} = require(`../../utils/utils`);
const {csrf} = require(`../utils/utils`);
const registerRouter = new Router();
const loginRouter = new Router();
const logoutRouter = new Router();

registerRouter.get(`/`, csrf, (req, res) => {
  res.render(`pages/auth/registration`, {csrf: req.csrfToken()});
  return;
});

registerRouter.post(`/`, [csrf, userImgUpload], async (req, res, next) => {
  try {
    const data = req.body;
    if (req.file) {
      data.file = req.file;
    }
    const registerData = await axios.post(`/users/auth/register`, data);
    if (registerData.status === 200) {
      res.redirect(`/login`);
    }
    return;
  } catch (error) {
    if (error.statusCode === 400 && Array.isArray(error.text)) {
      res.render(`pages/auth/registration`, {
        errors: error.text,
        csrf: req.csrfToken()
      });
      return;
    }
    next(error);
  }
});

loginRouter.get(`/`, csrf, (req, res) => {
  res.render(`pages/auth/login`, {csrf: req.csrfToken()});
  return;
});

loginRouter.post(`/`, csrf, catchAsync(async (req, res) => {
  const {data} = await axios.post(`/users/auth/login`, req.body);
  if (data) {
    req.session.uid = data;
    const {data: userData} = await axios.get(`/users/${data}`);
    res.locals.currentUser = userData;
  }
  res.redirect(`/`);
  return;
}));

logoutRouter.get(`/`, catchAsync(async (req, res) => {
  res.clearCookie(`sid`);
  res.redirect(`/login`);
  return;
}));

module.exports = {
  registerRouter,
  loginRouter,
  logoutRouter,
};
