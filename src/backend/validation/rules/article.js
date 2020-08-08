'use strict';

const {body} = require(`express-validator`);
const path = require(`path`);

const {validExtensions} = require(`../../../utils/upload`);

const articleValidators = (api) => ({
  title: (fieldEl) => fieldEl
    .isLength({min: 30, max: 250})
    .withMessage(`The title must contain a minimum of 30 characters and a maximum of 250`),
  file: (fieldEl) => fieldEl
    .custom((file) => {
      if (!file) {
        return true;
      } else {
        const ext = path.extname(file.originalname);
        return validExtensions.includes(ext);
      }
    })
    .withMessage(`Only png,jpg,jpeg files supported`),
  categories: (fieldEl) => fieldEl
    .toArray()
    .isArray({min: 1})
    .withMessage(`At least 1 category must be selected`)
    .custom(async (arr) => {
      await Promise.all(arr.map((id) => api.categories.findById(id)));
    }),
  announce: (fieldEl) => fieldEl
    .isLength({min: 30, max: 250})
    .withMessage(`The announcement must contain a minimum of 30 characters and a maximum of 250`),
  sentences: (fieldEl) => fieldEl
    .isLength({max: 1000})
    .withMessage(`Publication text must not exceed 1000 characters`),
});

const article = (api, optional) => {
  const articleFields = {
    title: optional ? body(`title`).optional() : body(`title`),
    file: optional ? body(`file`).optional() : body(`file`),
    categories: optional ? body(`categories`).optional() : body(`categories`),
    announce: optional ? body(`announce`).optional() : body(`announce`),
    sentences: optional ? body(`sentences`).optional() : body(`sentences`),
  };
  return Object.keys(articleFields).map((field) => articleValidators(api)[field](articleFields[field]));
};

module.exports = article;
