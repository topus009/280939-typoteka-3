'use strict';

const path = require(`path`);
const fsFromises = require(`fs`).promises;
const {Router} = require(`express`);
const {HttpCodes} = require(`../../../../config/constants`);
const {
  isFileExistsAsync,
  catchAsync,
} = require(`../../../utils/utils`);
const {
  validate,
  rules,
} = require(`../../validation`);
const {saveFile} = require(`../../../utils/upload`);

const router = (api) => {
  const articlesRouter = new Router();

  articlesRouter.get(`/`, catchAsync(async (req, res) => {
    let data;
    const {page} = req.query;
    if (!page) {
      data = await api.articles.getAll();
    } else {
      data = await api.articles.getArticlesByPage(page);
    }
    return res.status(HttpCodes.OK).json(data);
  }));

  articlesRouter.get(`/:id`, catchAsync(async (req, res) => {
    const {id} = req.params;
    const data = await api.articles.findById(id);
    return res.status(HttpCodes.OK).json(data);
  }));

  articlesRouter.get(`/categories/:categoryId`, catchAsync(async (req, res) => {
    const {categoryId} = req.params;
    const {page} = req.query;
    const data = await api.articles.getArticlesByCategoryId(categoryId, page);
    return res.status(HttpCodes.OK).json(data);
  }));

  articlesRouter.post(`/`, rules.article(api), validate, catchAsync(async (req, res) => {
    await saveFile(req, `img/articles`, [`img`]);
    const data = await api.articles.add(req.body);
    return res.status(HttpCodes.OK).json(data);
  }));

  articlesRouter.delete(`/:id`, catchAsync(async (req, res) => {
    const {id} = req.params;
    const data = await api.articles.delete(id);
    return res.status(HttpCodes.OK).json(data);
  }));

  articlesRouter.put(`/:id`, rules.article(api, true), validate, catchAsync(async (req, res) => {
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
