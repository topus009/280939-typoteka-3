'use strict';

const {Router} = require(`express`);
const {HttpCodes} = require(`../../../../config/constants`);

const errorsRouter = new Router();

errorsRouter.get(`*`, (req, res) => res.sendStatus(HttpCodes.HTTP_NOT_FOUND_CODE));

module.exports = errorsRouter;
