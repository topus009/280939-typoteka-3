'use strict';

const {body} = require(`express-validator`);

const category = () => ([
  body(`label`)
    .isLength({min: 5, max: 30})
    .withMessage(`The name must contain at least 5 characters and a maximum of 30`)
]);

const comment = () => ([
  body(`text`)
    .isLength({min: 20})
    .withMessage(`Comment must be at least 20 characters`)
]);

const post = () => ([
  body(`title`)
    .isLength({min: 30, max: 250})
    .withMessage(`The title must contain a minimum of 30 characters and a maximum of 250`),
  body(`categories`)
    .toArray()
    .isArray({min: 1})
    .withMessage(`At least 1 category must be selected`),
  body(`announce`)
    .isLength({min: 30, max: 250})
    .withMessage(`The announcement must contain a minimum of 30 characters and a maximum of 250`),
  body(`sentences`)
    .isLength({max: 1000})
    .withMessage(`Publication text must not exceed 1000 characters`),
]);

const rules = {
  category,
  comment,
  post,
};

module.exports = rules;
