'use strict';

const {commonErrorsHandler} = require(`../../utils/utils`);

const sendError = (res, next, error) => {
  res.status(error.statusCode).render(`pages/errors/error`, {error});
  next(error);
};

const errorsHandler = (log) => (error, req, res, next) => {
  commonErrorsHandler(log)(error, req, res, next, sendError);
};

module.exports = {
  errorsHandler,
};
