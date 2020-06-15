'use strict';

const {Router} = require(`express`);
const {
  categories,
  myCategories,
  posts,
  myPosts,
  comments,
  myComments,
  currentUser,
} = require(`../db`);

const myRouter = new Router();

myRouter.get(`/categories`, (req, res) => res.render(`pages/my/admin-categories`, {
  categories,
  myCategories,
}));

myRouter.get(`/comments`, (req, res) => res.render(`pages/my/admin-comments`, {
  currentUser,
  comments,
  myComments,
  posts,
}));

myRouter.get(`/publications`, (req, res) => res.render(`pages/my/admin-publications`, {
  posts,
  myPosts,
}));

module.exports = myRouter;
