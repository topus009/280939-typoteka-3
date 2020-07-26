'use strict';

const {Router} = require(`express`);

const authRouter = new Router();

authRouter.get(`/sign-up`, (req, res) => res.render(`pages/auth/auth`, {path: `sign-up`}));

authRouter.get(`/login`, (req, res) => res.render(`pages/auth/auth`, {path: `login`}));

module.exports = authRouter;
