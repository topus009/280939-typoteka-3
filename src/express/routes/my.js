'use strict';

const {Router} = require(`express`);

const MyRouter = new Router();

MyRouter.get(`/`, (req, res) => res.send(`/my`));
MyRouter.get(`/comments`, (req, res) => res.send(`/my/comments`));

module.exports = MyRouter;
