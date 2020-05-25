'use strict';

const {Router} = require(`express`);

const ArticlesRouter = new Router();

ArticlesRouter.get(`/category/:id`, (req, res) => res.send(`/articles/category/:id`));
ArticlesRouter.get(`/add`, (req, res) => res.send(`/articles/add`));
ArticlesRouter.get(`/edit/:id`, (req, res) => res.send(`/articles/edit/:id`));
ArticlesRouter.get(`/:id`, (req, res) => res.send(`/articles/:id`));

module.exports = ArticlesRouter;
