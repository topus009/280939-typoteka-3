'use strict';

const {Router} = require(`express`);
const {HttpCodes} = require(`../../../../../config/constants`);
const {validate, rules} = require(`../../validation`);

const router = (Api) => {
  const categoriesRouter = new Router();

  categoriesRouter.get(`/`, (req, res) => {
    const data = Api.categories.getAll();
    res.status(HttpCodes.OK).json(data);
  });

  categoriesRouter.get(`/:id`, (req, res) => {
    const {id} = req.params;
    const data = Api.categories.findById(id);
    res.status(HttpCodes.OK).json(data);
  });

  categoriesRouter.post(`/`, rules.category(), validate, (req, res) => {
    const data = Api.categories.add(req.body);
    res.status(HttpCodes.OK).json(data);
  });

  categoriesRouter.delete(`/:id`, (req, res) => {
    const {id} = req.params;
    const data = Api.categories.delete(id);
    res.status(HttpCodes.OK).json(data);
  });

  categoriesRouter.get(`/categories/my`, (req, res) => {
    const data = Api.categories.getMyCategories();
    res.status(HttpCodes.OK).json(data);
  });

  categoriesRouter.get(`/categories/count`, (req, res) => {
    const data = Api.categories.getCategoriesCount();
    res.status(HttpCodes.OK).json(data);
  });

  return categoriesRouter;
};

module.exports = router;
