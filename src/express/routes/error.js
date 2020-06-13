'use strict';

const {Router} = require(`express`);

const errorRouter = new Router();

errorRouter.get(``, (req, res) => {
  res.statusCode = 404;
  res.render(`pages/error/404`);
});

module.exports = errorRouter;
