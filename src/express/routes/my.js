'use strict';

const {Router} = require(`express`);
const Api = require(`../api/api`);

const myRouter = new Router();

myRouter.get(`/categories`, async (req, res) => {
  const [
    categories,
    myCategories,
  ] = await Promise.all([
    Api.categories.getAll(),
    Api.categories.getMyCategories(),
  ]);

  res.render(`pages/my/admin-categories`, {
    categories,
    myCategories,
  });
});

myRouter.get(`/comments`, async (req, res) => {
  const [
    comments,
    posts,
    myComments,
    currentUser,
  ] = await Promise.all([
    Api.comments.getAll(),
    Api.posts.getAll(),
    Api.comments.getMyComments(),
    Api.users.getUserByName(`Topolov Sergey`),
  ]);

  res.render(`pages/my/admin-comments`, {
    currentUser,
    comments,
    myComments,
    posts,
  });
});

myRouter.get(`/publications`, async (req, res) => {
  const [
    posts,
    myPosts,
  ] = await Promise.all([
    Api.posts.getAll(),
    Api.posts.getMyPosts(),
  ]);

  res.render(`pages/my/admin-publications`, {
    posts,
    myPosts,
  });
});

module.exports = myRouter;
