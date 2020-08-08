'use strict';

const path = require(`path`);
const fsFromises = require(`fs`).promises;
const {Router} = require(`express`);
const {HttpCodes} = require(`../../../../config/constants`);
const {
  isFileExistsAsync,
  CustomError,
  catchAsync,
} = require(`../../../utils/utils`);
const {
  validate,
  rules,
} = require(`../../validation`);

const router = (api) => {
  const articlesRouter = new Router();

  articlesRouter.get(`/`, catchAsync(async (req, res, next) => {
    let data;
    const {page} = req.query;
    if (!page) {
      data = await api.articles.getAll();
    } else {
      data = await api.articles.getArticlesByPage(page);
    }
    if (data instanceof CustomError) {
      return next(data);
    }
    return res.status(HttpCodes.OK).json(data);
  }));

  articlesRouter.get(`/:id`, catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const data = await api.articles.findById(id);
    if (data instanceof CustomError) {
      return next(data);
    }
    return res.status(HttpCodes.OK).json(data);
  }));

  articlesRouter.get(`/categories/:categoryId`, catchAsync(async (req, res, next) => {
    const {categoryId} = req.params;
    const {page} = req.query;
    const data = await api.articles.getArticlesByCategoryId(categoryId, page);
    if (data instanceof CustomError) {
      return next(data);
    }
    return res.status(HttpCodes.OK).json(data);
  }));

  articlesRouter.post(`/`, rules.article(api), validate, catchAsync(async (req, res) => {
    if (req.body.file) {
      const {file} = req.body;
      const backendImgPath = `img/articles/${file.filename}`;
      await fsFromises.rename(file.path, path.join(process.cwd(), `./src/frontend/public/${backendImgPath}`));
      delete req.body.file;
      req.body.img = backendImgPath;
    }
    const data = await api.articles.add(req.body);
    return res.status(HttpCodes.OK).json(data);
  }));

  articlesRouter.delete(`/:id`, catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const data = await api.articles.delete(id);
    if (data instanceof CustomError) {
      return next(data);
    }
    return res.status(HttpCodes.OK).json(data);
  }));

  articlesRouter.put(`/:id`, rules.article(api, true), validate, catchAsync(async (req, res, next) => {
    const {id} = req.params;
    if (req.body.file) {
      const {file} = req.body;
      const backendImgPath = `img/articles/${file.filename}`;
      const pathToDataBase = path.join(process.cwd(), `./src/frontend/public/`);
      const prevArticle = await api.articles.findById(id);
      if (prevArticle.img) {
        const pathToPrevFile = `${pathToDataBase}${prevArticle.img}`;
        const isExists = await isFileExistsAsync(pathToPrevFile);
        if (isExists) {
          await fsFromises.unlink(pathToPrevFile);
        }
      }
      await fsFromises.rename(file.path, `${pathToDataBase}${backendImgPath}`);
      delete req.body.file;
      req.body.img = backendImgPath;
    }
    const data = await api.articles.edit(id, req.body);
    if (data instanceof CustomError) {
      return next(data);
    }
    return res.status(HttpCodes.OK).json(data);
  }));

  articlesRouter.get(`/articles/my`, catchAsync(async (req, res) => {
    const data = await api.articles.getAll();
    return res.status(HttpCodes.OK).json(data);
  }));

  articlesRouter.get(`/articles/search`, catchAsync(async (req, res) => {
    const {query} = req.query;
    let data = {};
    if (query) {
      data = await api.articles.searchByTitle(query);
    }
    return res.status(HttpCodes.OK).json(data);
  }));

  articlesRouter.get(`/articles/hot`, catchAsync(async (req, res) => {
    const data = await api.articles.getHotArticles();
    return res.status(HttpCodes.OK).json(data);
  }));

  return articlesRouter;
};

module.exports = router;
