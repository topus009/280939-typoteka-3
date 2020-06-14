'use strict';

const {Router} = require(`express`);
const {HttpCodes} = require(`../../config/constants`);

const errorRouter = new Router();

errorRouter.get(``, (req, res) => {
  res.statusCode = HttpCodes.HTTP_NOT_FOUND_CODE;
  res.render(`pages/error/${HttpCodes.HTTP_NOT_FOUND_CODE}`);
});

module.exports = errorRouter;
