'use strict';

const {Router} = require(`express`);

const MainRouter = new Router();

MainRouter.get(`/`, (req, res) => res.send(`/`));
MainRouter.get(`/register`, (req, res) => res.send(`/register`));
MainRouter.get(`/login`, (req, res) => res.send(`/login`));

module.exports = MainRouter;
