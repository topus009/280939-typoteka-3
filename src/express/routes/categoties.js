'use strict';

const {Router} = require(`express`);

const CategoriesRouter = new Router();

CategoriesRouter.get(`/`, (req, res) => res.send(`/categories`));

module.exports = CategoriesRouter;
