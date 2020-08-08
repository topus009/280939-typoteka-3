'use strict';

const {Router} = require(`express`);
const axios = require(`../axios`);
const {catchAsync} = require(`../../utils/utils`);

const mainRouter = new Router();

mainRouter.get(`/`, catchAsync(async (req, res) => {
  const {page} = req.query;
  const {data} = await axios.get(`/pages/main`, {params: {page}});
  return res.render(`pages/main/main`, data);
}));

mainRouter.get(`/search`, catchAsync(async (req, res) => {
  const {query} = req.query;
  if (!query) {
    res.render(`pages/main/search`);
  } else {
    const {data} = await axios.get(`/pages/main/search`, {params: {query}});
    res.render(`pages/main/search`, data);
  }
  return;
}));

mainRouter.get(`/category/:id`, catchAsync(async (req, res) => {
  const {id} = req.params;
  const {page} = req.query;
  const {data} = await axios.get(`/pages/main/category/${id}`, {params: {page}});
  return res.render(`pages/main/category`, data);
}));

module.exports = mainRouter;
