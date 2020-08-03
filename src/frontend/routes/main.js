'use strict';

const {Router} = require(`express`);
const axios = require(`../axios`);

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  const {page} = req.query;
  const {data} = await axios.get(`/pages/main`, {params: {page}});
  res.render(`pages/main/main`, data);
});

mainRouter.get(`/search`, async (req, res) => {
  const {query} = req.query;
  if (!query) {
    res.render(`pages/main/search`);
  } else {
    const {data} = await axios.get(`/pages/main/search`, {params: {query}});
    res.render(`pages/main/search`, data);
  }
});

mainRouter.get(`/category/:id`, async (req, res) => {
  const {id} = req.params;
  const {page} = req.query;
  const {data} = await axios.get(`/pages/main/category/${id}`, {params: {page}});
  res.render(`pages/main/category`, data);
});

module.exports = mainRouter;
