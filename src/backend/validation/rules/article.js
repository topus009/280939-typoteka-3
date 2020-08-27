'use strict';

const {body} = require(`express-validator`);
const path = require(`path`);
const {
  ARTICLE_TITLE_MIN_LETTERS,
  ARTICLE_TITLE_MAX_LETTERS,
  MIN_CATEGORY_SELECTED,
  ARTICLE_ANNOUNCE_MIN_LETTERS,
  ARTICLE_ANNOUNCE_MAX_LETTERS,
  ARTICLE_FULLTEXT_MAX_LETTERS,
  ValidImgExtensions,
} = require(`../../../../config/constants`);
const fm = require(`../../../utils/localization`);

const articleValidators = (api) => ({
  title: (fieldEl) => fieldEl
    .isLength({
      min: ARTICLE_TITLE_MIN_LETTERS,
      max: ARTICLE_TITLE_MAX_LETTERS,
    })
    .withMessage(fm(`ARTICLE_TITLE_MINMAX_LETTERS`)),
  file: (fieldEl) => fieldEl
    .custom((file) => {
      if (!file) {
        return true;
      }
      const ext = path.extname(file.originalname);
      return ValidImgExtensions.includes(ext);
    })
    .withMessage(fm(`ONLY_FILES_SUPPORTED`)),
  categories: (fieldEl) => fieldEl
    .toArray()
    .isArray({min: MIN_CATEGORY_SELECTED})
    .withMessage(fm(`MIN_CATEGORY_SELECTED`))
    .custom(async (arr) => {
      await Promise.all(arr.map((id) => api.categories.findById(id)));
    }),
  announce: (fieldEl) => fieldEl
    .isLength({
      min: ARTICLE_ANNOUNCE_MIN_LETTERS,
      max: ARTICLE_ANNOUNCE_MAX_LETTERS,
    })
    .withMessage(fm(`ARTICLE_ANNOUNCE_MINMAX_LETTERS`)),
  sentences: (fieldEl) => fieldEl
    .isLength({max: ARTICLE_FULLTEXT_MAX_LETTERS})
    .withMessage(fm(`ARTICLE_FULLTEXT_MAX_LETTERS`)),
});

const article = (api, optional) => {
  const articleFields = {
    title: optional ? body(`title`).optional() : body(`title`),
    file: optional ? body(`file`).optional() : body(`file`),
    categories: optional ? body(`categories`).optional() : body(`categories`),
    announce: optional ? body(`announce`).optional() : body(`announce`),
    sentences: optional ? body(`sentences`).optional() : body(`sentences`),
  };
  return Object.keys(articleFields).map((field) => {
    return articleValidators(api)[field](articleFields[field]);
  });
};

module.exports = article;
