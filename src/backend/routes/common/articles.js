'use strict';

const {Router} = require(`express`);
const {
  BACKEND_ARTICLES_PATH,
  HttpCodes,
} = require(`../../../../config/constants`);
const {catchAsync} = require(`../../../utils/utils`);
const {
  saveFile,
  deletePrevArticleImg,
} = require(`../../../utils/upload`);
const {
  validationMiddleware,
  rulesMiddleware,
} = require(`../../validation`);

const articlesRouter = new Router();

const router = (api) => {
  articlesRouter.get(`/`, catchAsync(async (req, res) => {
    let data;
    const {page} = req.query;
    if (!page) {
      data = await api.articles.getAll();
    } else {
      data = await api.articles.getAllByPage(page);
    }
    res.status(HttpCodes.OK).json(data);
    return;
  }));

  articlesRouter.get(`/:id`, catchAsync(async (req, res) => {
    const {id} = req.params;
    const data = await api.articles.findById(id);
    res.status(HttpCodes.OK).json(data);
    return;
  }));

  articlesRouter.get(`/categories/:categoryId`, catchAsync(async (req, res) => {
    const {categoryId} = req.params;
    const {page} = req.query;
    const data = await api.articles.getAllByCategoryId(categoryId, page);
    res.status(HttpCodes.OK).json(data);
    return;
  }));

  articlesRouter.post(`/`, [
    rulesMiddleware.article(api),
    validationMiddleware,
  ], catchAsync(async (req, res) => {
    const fieldNames = [`img`];
    await saveFile(req, BACKEND_ARTICLES_PATH, fieldNames);
    const data = await api.articles.add(req.body);
    res.status(HttpCodes.OK).json(data);
    return;
  }));

  articlesRouter.delete(`/:id`, catchAsync(async (req, res) => {
    const {id} = req.params;
    const data = await api.articles.delete(id);
    res.status(HttpCodes.OK).json(data);
    return;
  }));

  articlesRouter.put(`/:id`, [
    rulesMiddleware.article(api, true),
    validationMiddleware,
  ], catchAsync(async (req, res) => {
    const {id} = req.params;
    const fieldNames = [`img`];
    await saveFile(
      req,
      BACKEND_ARTICLES_PATH,
      fieldNames,
      () => deletePrevArticleImg(api, id),
    );
    const data = await api.articles.edit(id, req.body);
    res.status(HttpCodes.OK).json(data);
    return;
  }));

  articlesRouter.get(`/articles/my`, catchAsync(async (req, res) => {
    const data = await api.articles.getAll();
    res.status(HttpCodes.OK).json(data);
    return;
  }));

  articlesRouter.get(`/articles/search`, catchAsync(async (req, res) => {
    const {query} = req.query;
    let data = {};
    if (query) {
      data = await api.articles.searchByTitle(query);
    }
    res.status(HttpCodes.OK).json(data);
    return;
  }));

  articlesRouter.get(`/articles/hot`, catchAsync(async (req, res) => {
    const data = await api.articles.getHot();
    res.status(HttpCodes.OK).json(data);
    return;
  }));
  return articlesRouter;
};

module.exports = router;
