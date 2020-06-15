'use strict';

const {Router} = require(`express`);

const errorsRouter = new Router();

errorsRouter.get(`*`, (req, res) => res.send(404));

module.exports = errorsRouter;
