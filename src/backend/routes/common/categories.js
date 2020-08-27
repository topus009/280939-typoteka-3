'use strict';

const {Router} = require(`express`);
const {HttpCodes} = require(`../../../../config/constants`);
const {catchAsync} = require(`../../../utils/utils`);
const {
  validationMiddleware,
  rulesMiddleware,
} = require(`../../validation`);

const categoriesRouter = new Router();

const router = (api) => {
  categoriesRouter.get(`/`, catchAsync(async (req, res) => {
    const data = await api.categories.getAll();
    res.status(HttpCodes.OK).json(data);
    return;
  }));

  categoriesRouter.get(`/:id`, catchAsync(async (req, res) => {
    const {id} = req.params;
    const data = await api.categories.findById(id);
    res.status(HttpCodes.OK).json(data);
    return;
  }));

  categoriesRouter.post(`/`, [
    rulesMiddleware.category(api),
    validationMiddleware,
  ], catchAsync(async (req, res) => {
    const data = await api.categories.add(req.body);
    res.status(HttpCodes.OK).json(data);
    return;
  }));

  categoriesRouter.put(`/:id`, [
    rulesMiddleware.category(api),
    validationMiddleware,
  ], catchAsync(async (req, res) => {
    const {id} = req.params;
    const data = await api.categories.edit(id, req.body);
    res.status(HttpCodes.OK).json(data);
    return;
  }));

  categoriesRouter.delete(`/:id`, catchAsync(async (req, res) => {
    const {id} = req.params;
    const data = await api.categories.delete(id);
    res.status(HttpCodes.OK).json(data);
    return;
  }));

  categoriesRouter.get(`/categories/my`, catchAsync(async (req, res) => {
    const data = await api.categories.getAll();
    res.status(HttpCodes.OK).json(data);
    return;
  }));

  categoriesRouter.get(`/categories/count`, catchAsync(async (req, res) => {
    const data = await api.categories.countAll();
    res.status(HttpCodes.OK).json(data);
    return;
  }));
  return categoriesRouter;
};

module.exports = router;
