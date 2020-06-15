'use strict';

const users = require(`../../../mockData/users.json`);
const posts = require(`../../../mockData/mocks.json`);
const comments = require(`../../../mockData/comments.json`);
const {getCurrentUser, getMyData} = require(`./utils`);

const currentUser = getCurrentUser(users, `Topolov Sergey`);

const {
  myComments,
  myPosts,
  myCategories,
} = getMyData({currentUser, comments, posts});

module.exports = {
  currentUser,
  myComments,
  myPosts,
  myCategories,
};
