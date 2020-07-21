'use strict';

const {body} = require(`express-validator`);
const path = require(`path`);

const category = () => ([
  body(`label`)
    .isLength({min: 5, max: 30})
    .withMessage(`The name must contain at least 5 characters and a maximum of 30`)
]);

const comment = () => ([
  body(`comment`)
    .isLength({min: 20})
    .withMessage(`Comment must be at least 20 characters`)
]);

const validExtensions = [`.png`, `.jpg`, `.jpeg`];

const article = () => ([
  body(`title`)
    .isLength({min: 30, max: 250})
    .withMessage(`The title must contain a minimum of 30 characters and a maximum of 250`),
  body(`file`)
    .custom((file) => {
      if (!file) {
        return true;
      } else {
        const ext = path.extname(file.originalname);
        return validExtensions.includes(ext);
      }
    })
    .withMessage(`Only png,jpg,jpeg files supported`),
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
  article,
};

module.exports = rules;
