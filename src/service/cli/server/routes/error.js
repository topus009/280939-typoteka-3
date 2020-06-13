'use strict';

const {Router} = require(`express`);

const errorsRouter = new Router();

errorsRouter.get(``, (req, res, next) => {
  res.status(404);
  next();
});

module.exports = errorsRouter;
