'use strict';

const {Router} = require(`express`);
const {HttpCodes} = require(`../../../../../config/constants`);

const router = () => {
  const errorsRouter = new Router();

  errorsRouter.get(`*`, (req, res) => res.sendStatus(HttpCodes.NOT_FOUND));

  return errorsRouter;
};

module.exports = router;
