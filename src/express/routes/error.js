'use strict';

const {Router} = require(`express`);
const {HttpCodes} = require(`../../config/constants`);

const errorRouter = new Router();

errorRouter.get(``, (req, res) => {
  res.statusCode = HttpCodes.NOT_FOUND;
  res.render(`pages/error/${HttpCodes.NOT_FOUND}`);
});

module.exports = errorRouter;
