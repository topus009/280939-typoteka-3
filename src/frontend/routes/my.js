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
    data,
    csrf: req.csrfToken()
  });
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

myRouter.get(`/articles`, [auth, admin], catchAsync(async (req, res) => {
  const {data} = await axios.get(`/pages/my/articles`);
  return res.render(`pages/my/admin-articles`, data);
}));

module.exports = myRouter;
