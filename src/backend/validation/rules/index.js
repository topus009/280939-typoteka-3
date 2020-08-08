'use strict';

const user = require(`./user`);
const category = require(`./category`);
const comment = require(`./comment`);
const article = require(`./article`);

const rules = {
  user,
  category,
  comment,
  article,
};

module.exports = rules;
