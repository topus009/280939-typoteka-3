'use strict';

const {Router} = require(`express`);
const Api = require(`../api/api`);

const myRouter = new Router();

myRouter.get(`/categories`, async (req, res) => {
  const categories = await Api.categories.getAll();
  const myCategories = await Api.categories.getMyCategories();

  res.render(`pages/my/admin-categories`, {
    categories,
    myCategories,
  });
});

myRouter.get(`/comments`, async (req, res) => {
  const comments = await Api.comments.getAll();
  const posts = await Api.posts.getAll();
  const myComments = await Api.comments.getMyComments();
  const currentUser = await Api.users.getUserByName(`Topolov Sergey`);

  res.render(`pages/my/admin-comments`, {
    currentUser,
    comments,
    myComments,
    posts,
  });
});

myRouter.get(`/publications`, async (req, res) => {
  const posts = await Api.posts.getAll();
  const myPosts = await Api.posts.getMyPosts();

  res.render(`pages/my/admin-publications`, {
    posts,
    myPosts,
  });
});

module.exports = myRouter;
