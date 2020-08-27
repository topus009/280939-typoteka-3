'use strict';

const {Router} = require(`express`);
const {catchAsync} = require(`../../utils/utils`);
const axios = require(`../axios`);
const {csrfMiddleware} = require(`../utils/utils`);

const mainRouter = new Router();

mainRouter.get(`/`, catchAsync(async (req, res) => {
  const {page} = req.query;
  const {data} = await axios.get(`/pages/main`, {params: {page}});
  res.render(`pages/main/main`, data);
  return;
}));

mainRouter.get(`/search`, [
  csrfMiddleware,
], catchAsync(async (req, res) => {
  const {query} = req.query;
  if (!query) {
    res.render(`pages/main/search`);
  } else {
    const {data} = await axios.get(`/pages/main/search`, {
      params: {query},
      csrf: req.csrfToken(),
    });
    res.render(`pages/main/search`, data);
  }
  return;
}));

mainRouter.get(`/category/:id`, catchAsync(async (req, res) => {
  const {id} = req.params;
  const {page} = req.query;
  const {data} = await axios.get(`/pages/main/category/${id}`, {params: {page}});
  res.render(`pages/main/category`, data);
  return;
}));

module.exports = mainRouter;
