'use strict';

const users = require(`../../../mockData/users.json`);
const posts = require(`../../../mockData/mocks.json`);
const comments = require(`../../../mockData/comments.json`);
const categories = require(`../../../mockData/categories.json`);
const {
  currentUser,
  myComments,
  myPosts,
  myCategories,
} = require(`./db`);

module.exports = {
  users,
  posts,
  comments,
  categories,
  currentUser,
  myComments,
  myPosts,
  myCategories,
};
