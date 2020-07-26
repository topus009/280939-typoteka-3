'use strict';

const {validationResult} = require(`express-validator`);
const {CustomError} = require(`../../utils/utils`);
const {HttpCodes} = require(`../../../config/constants`);

const getErrorObject = (err, req) => {
  const errObj = {[err.param]: err.msg};
  if (req.params.id) {
    errObj.id = req.params.id;
  }
  return errObj;
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];

  errors.array().map((err) => extractedErrors.push(getErrorObject(err, req)));

  throw new CustomError(HttpCodes.BAD_REQUEST, extractedErrors);
};

module.exports = validate;
