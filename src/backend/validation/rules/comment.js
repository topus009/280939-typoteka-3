'use strict';

const {body} = require(`express-validator`);

const comment = () => ([
  body(`comment`)
    .isLength({min: 20})
    .withMessage(`Comment must be at least 20 characters`),
]);

module.exports = comment;
