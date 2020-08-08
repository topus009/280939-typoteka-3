'use strict';

const {body} = require(`express-validator`);

const category = (api) => ([
  body(`label`)
    .isLength({min: 5, max: 30})
    .withMessage(`The name must contain at least 5 characters and a maximum of 30`)
    .bail()
    .custom(async (label) => {
      const data = await api.categories.findByLabel(label);
      if (data) {
        throw new Error(_f(`DUPLICATE_CATEGORY_LABEL`, {label}));
      }
    }),
]);

module.exports = category;
