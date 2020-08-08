'use strict';

const {Router} = require(`express`);
const axios = require(`../axios`);
const {userImgUpload} = require(`../../utils/upload`);
const registerRouter = new Router();
const loginRouter = new Router();

registerRouter.get(`/`, (req, res) => res.render(`pages/auth/registration`));

registerRouter.post(`/`, userImgUpload, async (req, res, next) => {
  try {
    const data = req.body;
    if (req.file) {
      data.file = req.file;
    }
    const registerData = await axios.post(`/users/register`, data);
    if (registerData.status === 200) {
      res.redirect(`/login`);
    }
  } catch (error) {
    if (error.statusCode === 400 && Array.isArray(error.text)) {
      res.render(`pages/auth/registration`, {errors: error.text});
      return;
    }
    next(error);
  }
});

loginRouter.get(`/`, (req, res) => res.render(`pages/auth/login`));

module.exports = {
  registerRouter,
  loginRouter,
};
