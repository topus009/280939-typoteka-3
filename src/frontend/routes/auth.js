'use strict';

const {Router} = require(`express`);
const axios = require(`../axios`);
const {userImgUpload} = require(`../../utils/upload`);
const {catchAsync} = require(`../../utils/utils`);
const registerRouter = new Router();
const loginRouter = new Router();
const logoutRouter = new Router();

registerRouter.get(`/`, (req, res) => res.render(`pages/auth/registration`));

registerRouter.post(`/`, userImgUpload, async (req, res, next) => {
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
      res.render(`pages/auth/registration`, {errors: error.text});
      return;
    }
    next(error);
  }
});

loginRouter.get(`/`, (req, res) => res.render(`pages/auth/login`));

loginRouter.post(`/`, catchAsync(async (req, res) => {
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
