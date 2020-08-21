'use strict';

const {Router} = require(`express`);
const axios = require(`../axios`);
const {catchAsync} = require(`../../utils/utils`);
const {
  auth,
  admin,
  csrf,
} = require(`../utils/utils`);

const myRouter = new Router();

myRouter.get(`/categories`, [auth, admin, csrf], catchAsync(async (req, res) => {
  const {data} = await axios.get(`/pages/my/categories`);
  return res.render(`pages/my/admin-categories`, {
    ...data,
    csrf: req.csrfToken()
  });
}));

myRouter.get(`/categories/delete/:id`, [auth, admin], catchAsync(async (req, res) => {
  const {id} = req.params;
  await axios.delete(`/categories/${id}`);
  return res.redirect(`/my/categories`);
}));

myRouter.post(`/categories`, [auth, admin, csrf], async (req, res, next) => {
  const {id, label} = req.body;
  try {
    let method = id ? `put` : `post`;
    let path = id ? `/categories/${id}` : `/categories`;
    const apiReq = await axios[method](path, {label});
    if (apiReq.status === 200) {
      res.redirect(`/my/categories`);
    }
    return;
  } catch (error) {
    if (error.statusCode === 400) {
      const {data} = await axios.get(`/pages/my/categories`);
      const errors = Array.isArray(error.text) ? error.text : [{
        id: +id,
        label: error.text
      }];
      res.render(`pages/my/admin-categories`, {
        ...data,
        errors,
        csrf: req.csrfToken()
      });
      return;
    }
    next(error);
  }
});

myRouter.get(`/comments`, [auth, admin], catchAsync(async (req, res) => {
  const {data} = await axios.get(`/pages/my/comments`);
  return res.render(`pages/my/admin-comments`, data);
}));

myRouter.get(`/comments/:articleId/:id/delete`, [auth, admin], catchAsync(async (req, res) => {
  const {id, articleId} = req.params;
  await axios.delete(`/comments/article/${articleId}/${id}`);
  return res.redirect(`/my/comments`);
}));

myRouter.get(`/articles`, [auth, admin], catchAsync(async (req, res) => {
  const {data} = await axios.get(`/pages/my/articles`);
  return res.render(`pages/my/admin-articles`, data);
}));

myRouter.get(`/articles/delete/:id`, [auth, admin], catchAsync(async (req, res) => {
  const {id} = req.params;
  await axios.delete(`/articles/${id}`);
  return res.redirect(`/my/articles`);
}));

module.exports = myRouter;
