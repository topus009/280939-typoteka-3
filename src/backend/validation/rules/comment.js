'use strict';

const {body} = require(`express-validator`);
const {COMMENT_MIN_LETTERS} = require(`../../../../config/constants`);

const comment = () => [
  body(`comment`)
    .isLength({min: COMMENT_MIN_LETTERS})
    .withMessage(_f(`COMMENT_MIN_LETTERS`)),
];

module.exports = comment;
