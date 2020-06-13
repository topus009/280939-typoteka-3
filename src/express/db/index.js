'use strict';

const users = require(`../../../mockData/users.json`);
const posts = require(`../../../mockData/mocks.json`);
const comments = require(`../../../mockData/comments.json`);
const categories = require(`../../../mockData/categories.json`);
const {getMyData} = require(`./utils`);

const currentUser = users.find((user) => user.name === `Topolov Sergey`);
const {
  myComments,
  myPosts,
  myCategories,
} = getMyData({currentUser, comments, posts});

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
