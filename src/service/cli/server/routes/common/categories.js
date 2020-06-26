'use strict';

const {Router} = require(`express`);
const {HttpCodes} = require(`../../../../../config/constants`);
const {validate, rules} = require(`../../validation`);

const router = (api) => {
  const categoriesRouter = new Router();

  categoriesRouter.get(`/`, (req, res) => {
    const data = api.categories.getAll();
    res.status(HttpCodes.OK).json(data);
  });

  categoriesRouter.get(`/:id`, (req, res) => {
    const {id} = req.params;
    const data = api.categories.findById(id);
    res.status(HttpCodes.OK).json(data);
  });

  categoriesRouter.post(`/`, rules.category(), validate, (req, res) => {
    const data = api.categories.add(req.body);
    res.status(HttpCodes.OK).json(data);
  });

  categoriesRouter.delete(`/:id`, (req, res) => {
    const {id} = req.params;
    const data = api.categories.delete(id);
    res.status(HttpCodes.OK).json(data);
  });

  categoriesRouter.get(`/categories/my`, (req, res) => {
    const data = api.categories.getMyCategories();
    res.status(HttpCodes.OK).json(data);
  });

  categoriesRouter.get(`/categories/count`, (req, res) => {
    const data = api.categories.getCategoriesCount();
    res.status(HttpCodes.OK).json(data);
  });

  return categoriesRouter;
};

module.exports = router;
