'use strict';

const {body} = require(`express-validator`);
const {
  CATEGORY_LABEL_MIN_LETTERS,
  CATEGORY_LABEL_MAX_LETTERS,
} = require(`../../../../config/constants`);

const category = (api) => [
  body(`label`)
    .isLength({
      min: CATEGORY_LABEL_MIN_LETTERS,
      max: CATEGORY_LABEL_MAX_LETTERS,
    })
    .withMessage(_f(`CATEGORY_LABEL_MINMAX_LETTERS`))
    .bail()
    .custom(async (label) => {
      const data = await api.categories.findByLabel(label);
      if (data) {
        throw new Error(_f(`DUPLICATE_CATEGORY_LABEL`, {label}));
      }
    }),
];

module.exports = category;
