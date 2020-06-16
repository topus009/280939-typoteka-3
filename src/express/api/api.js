"use strict";

const common = require(`./common/common`);
const users = require(`./users/users`);
const categories = require(`./categories/categories`);
const posts = require(`./posts/posts`);
const comments = require(`./comments/comments`);

const Api = {
  common,
  users,
  categories,
  posts,
  comments,
};

module.exports = Api;
