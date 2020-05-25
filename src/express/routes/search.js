'use strict';

const {Router} = require(`express`);

const SearchRouter = new Router();

SearchRouter.get(`/`, (req, res) => res.send(`/search`));

module.exports = SearchRouter;
