'use strict';

const {Router} = require(`express`);
const axios = require(`../axios`);

const myRouter = new Router();

myRouter.get(`/categories`, async (req, res) => {
  const {data} = await axios.get(`/pages/my/categories`);
  res.render(`pages/my/admin-categories`, data);
});

myRouter.post(`/categories`, async (req, res, next) => {
  try {
    const {id, label} = req.body;
    let method = id ? `put` : `post`;
    let path = id ? `/common/categories/${id}` : `/common/categories`;
    const apiReq = await axios[method](path, {label});
    if (apiReq.status === 200) {
      res.redirect(`/my/categories`);
    }
  } catch (error) {
    if (error.statusCode === 400 && Array.isArray(error.text)) {
      const {data} = await axios.get(`/pages/my/categories`);
      res.render(`pages/my/admin-categories`, {...data, errors: error.text});
      return;
    }
    next(error);
  }
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
