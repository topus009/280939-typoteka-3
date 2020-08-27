'use strict';

const {HttpCodes} = require(`../../../config/constants`);
const {
  CustomError,
  capitalizeFirstLetter,
  useCommonErrorsHandler,
} = require(`../../utils/utils`);

const sendError = (res, next, error) => {
  return res
    .status(error.statusCode)
    .json(error);
};

const errorsMiddleware = (log) => (error, req, res, next) => {
  let errObj = error;
  if (!(errObj instanceof CustomError)) {
    const text = capitalizeFirstLetter(errObj.text || error.message).replace(/"/g, `'`);
    const statusCode = errObj.statusCode || HttpCodes.INTERNAL_SERVER_ERROR;
    errObj = new CustomError(statusCode, text);
  }
  return useCommonErrorsHandler(log)(errObj, req, res, next, sendError);
};

module.exports = {
  errorsMiddleware,
};
