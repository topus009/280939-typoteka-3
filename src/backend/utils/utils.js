'use strict';

const {HttpCodes} = require(`../../../config/constants`);
const {
  CustomError,
  capitalizeFirstLetter,
  commonErrorsHandler,
} = require(`../../utils/utils`);

const sendError = (res, next, error) => {
  res.status(error.statusCode).json(error);
  next(error);
};

const errorsHandler = (log) => (error, req, res, next) => {
  let errObj = error;
  if (errObj.name === `SequelizeForeignKeyConstraintError`) {
    const {original} = errObj;
    if (original.constraint === `articles_categories_categoryId_fkey`) {
      const {detail} = original;
      const id = detail.replace(/\D/g, ``);
      const text = _f(`NO_CATEGORY_ID`, {id});
      const statusCode = HttpCodes.BAD_REQUEST;
      errObj = new CustomError(statusCode, text);
    }
  } else if (error.name === `SequelizeUniqueConstraintError`) {
    const {original} = errObj;
    if (original.constraint === `categories_label_key`) {
      errObj = new CustomError(HttpCodes.BAD_REQUEST, _f(`DUPLICATE_CATEGORY_LABEL`));
    }
  } else if (!(errObj instanceof CustomError)) {
    const text = capitalizeFirstLetter(errObj.text || error.message).replace(/"/g, `'`);
    const statusCode = errObj.statusCode || HttpCodes.INTERNAL_SERVER_ERROR;
    errObj = new CustomError(statusCode, text);
  }

  commonErrorsHandler(log)(errObj, req, res, next, sendError);
};

module.exports = {
  errorsHandler,
};
