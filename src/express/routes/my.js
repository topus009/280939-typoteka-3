'use strict';

const {Router} = require(`express`);
const axios = require(`../axios`);

const myRouter = new Router();

myRouter.get(`/categories`, async (req, res) => {
  const {data} = await axios.get(`/pages/my/categories`);
  res.render(`pages/my/admin-categories`, data);
});

myRouter.get(`/comments`, async (req, res) => {
  const {data} = await axios.get(`/pages/my/comments`);
  res.render(`pages/my/admin-comments`, data);
});

myRouter.get(`/posts`, async (req, res) => {
  const {data} = await axios.get(`/pages/my/posts`);
  res.render(`pages/my/admin-posts`, data);
});

module.exports = myRouter;
