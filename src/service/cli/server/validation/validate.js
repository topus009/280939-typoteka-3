'use strict';

const {validationResult} = require(`express-validator`);
const {Err} = require(`../../../../utils/utils`);
const {HttpCodes} = require(`../../../../config/constants`);

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];

  errors.array().map((err) => extractedErrors.push({[err.param]: err.msg}));

  throw new Err(HttpCodes.BAD_REQUEST, extractedErrors);
};

module.exports = validate;
