'use strict';

const {body} = require(`express-validator`);
const {
  CATEGORY_LABEL_MIN_LETTERS,
  CATEGORY_LABEL_MAX_LETTERS,
} = require(`../../../../config/constants`);
const fm = require(`../../../utils/localization`);

const category = (api) => [
  body(`label`)
    .isLength({
      min: CATEGORY_LABEL_MIN_LETTERS,
      max: CATEGORY_LABEL_MAX_LETTERS,
    })
    .withMessage(fm(`CATEGORY_LABEL_MINMAX_LETTERS`))
    .bail()
    .custom(async (label) => {
      const data = await api.categories.findByLabel(label);
      if (data) {
        throw new Error(fm(`DUPLICATE_CATEGORY_LABEL`, {label}));
      }
    }),
];

module.exports = category;
