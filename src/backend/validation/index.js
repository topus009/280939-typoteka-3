'use strict';

const rulesMiddleware = require(`./rules`);
const {validationMiddleware} = require(`./validate`);

module.exports = {
  rulesMiddleware,
  validationMiddleware,
};
