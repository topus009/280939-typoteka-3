'use strict';

const {commonErrorsHandler} = require(`../../utils/utils`);

const sendError = (res, next, error) => {
  return res
    .status(error.statusCode)
    .render(`pages/errors/error`, {error});
};

const errorsHandler = (log) => (error, req, res, next) => {
  return commonErrorsHandler(log)(error, req, res, next, sendError);
};

module.exports = {
  errorsHandler,
};
