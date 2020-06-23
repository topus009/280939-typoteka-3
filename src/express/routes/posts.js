'use strict';

const {Router} = require(`express`);
const axios = require(`../axios`);

const postsRouter = new Router();

postsRouter.get(`/post/:id`, async (req, res) => {
  const {id} = req.params;
  const {data} = await axios.get(`/pages/posts/post/${id}`);
  res.render(`pages/posts/post`, data);
});

postsRouter.get(`/new`, async (req, res) => {
  const {data} = await axios.get(`/pages/posts/new`);
  res.render(`pages/posts/new-post`, data);
});

module.exports = postsRouter;
