'use strict';

const {Router} = require(`express`);
const {HttpCodes} = require(`../../../config/constants`);
const {catchAsync} = require(`../../utils/utils`);
const axios = require(`../axios`);
const {
  authMiddleware,
  adminMiddleware,
  csrfMiddleware,
} = require(`../utils/utils`);

const myRouter = new Router();

myRouter.get(`/categories`, [
  authMiddleware,
  adminMiddleware,
  csrfMiddleware,
], catchAsync(async (req, res) => {
  const {data} = await axios.get(`/pages/my/categories`);
  res.render(`pages/my/admin-categories`, {
    ...data,
    csrf: req.csrfToken(),
  });
  return;
}));

myRouter.get(`/categories/delete/:id`, [
  authMiddleware,
  adminMiddleware,
], catchAsync(async (req, res) => {
  const {id} = req.params;
  await axios.delete(`/categories/${id}`);
  res.redirect(`/my/categories`);
  return;
}));

myRouter.post(`/categories`, [
  authMiddleware,
  adminMiddleware,
  csrfMiddleware,
], async (req, res, next) => {
  const {id, label} = req.body;
  try {
    const apiReq = await axios[id ? `put` : `post`](`/categories${id ? `/${id}` : ``}`, {label});
    if (apiReq.status === HttpCodes.OK) {
      res.redirect(`/my/categories`);
    }
    return;
  } catch (error) {
    if (error.statusCode === HttpCodes.BAD_REQUEST) {
      const {data} = await axios.get(`/pages/my/categories`);
      const errors = Array.isArray(error.text) ? error.text : [{
        id: +id,
        label: error.text,
      }];
      res.render(`pages/my/admin-categories`, {
        ...data,
        errors,
        csrf: req.csrfToken(),
      });
      return;
    }
    next(error);
  }
});

myRouter.get(`/comments`, [
  authMiddleware,
  adminMiddleware,
], catchAsync(async (req, res) => {
  const {data} = await axios.get(`/pages/my/comments`);
  res.render(`pages/my/admin-comments`, data);
  return;
}));

myRouter.get(`/comments/:articleId/:id/delete`, [
  authMiddleware,
  adminMiddleware,
], catchAsync(async (req, res) => {
  const {id, articleId} = req.params;
  await axios.delete(`/comments/article/${articleId}/${id}`);
  res.redirect(`/my/comments`);
  return;
}));

myRouter.get(`/articles`, [
  authMiddleware,
  adminMiddleware,
], catchAsync(async (req, res) => {
  const {data} = await axios.get(`/pages/my/articles`);
  res.render(`pages/my/admin-articles`, data);
  return;
}));

myRouter.get(`/articles/delete/:id`, [
  authMiddleware,
  adminMiddleware,
], catchAsync(async (req, res) => {
  const {id} = req.params;
  await axios.delete(`/articles/${id}`);
  res.redirect(`/my/articles`);
  return;
}));

module.exports = myRouter;
