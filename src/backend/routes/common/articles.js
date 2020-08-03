'use strict';

const path = require(`path`);
const fsFromises = require(`fs`).promises;
const {Router} = require(`express`);
const {HttpCodes} = require(`../../../../config/constants`);
const {isFileExistsAsync, CustomError} = require(`../../../utils/utils`);
const {validate, rules} = require(`../../validation`);

const router = (api) => {
  const articlesRouter = new Router();

  articlesRouter.get(`/`, async (req, res, next) => {
    let data;
    const {page} = req.query;
    try {
      if (!page) {
        data = await api.articles.getAll();
      } else {
        data = await api.articles.getArticlesByPage(page);
      }
      if (data instanceof CustomError) {
        return next(data);
      }
      return res.status(HttpCodes.OK).json(data);
    } catch (error) {
      return error;
    }
  });

  articlesRouter.get(`/:id`, async (req, res, next) => {
    try {
      const {id} = req.params;
      const data = await api.articles.findById(id);
      if (data instanceof CustomError) {
        return next(data);
      }
      return res.status(HttpCodes.OK).json(data);
    } catch (error) {
      return error;
    }
  });

  articlesRouter.get(`/categories/:categoryId`, async (req, res, next) => {
    try {
      const {categoryId} = req.params;
      const {page} = req.query;
      const data = await api.articles.getArticlesByCategoryId(categoryId, page);
      if (data instanceof CustomError) {
        return next(data);
      }
      return res.status(HttpCodes.OK).json(data);
    } catch (error) {
      return error;
    }
  });

  articlesRouter.post(`/`, rules.article(), validate, async (req, res) => {
    if (req.body.file) {
      const {file} = req.body;
      const backendImgPath = `img/articles/${file.filename}`;
      await fsFromises.rename(file.path, path.join(process.cwd(), `./src/frontend/public/${backendImgPath}`));
      delete req.body.file;
      req.body.img = backendImgPath;
    }
    const data = await api.articles.add(req.body);
    res.status(HttpCodes.OK).json(data);
  });

  articlesRouter.delete(`/:id`, async (req, res, next) => {
    try {
      const {id} = req.params;
      const data = await api.articles.delete(id);
      if (data instanceof CustomError) {
        return next(data);
      }
      return res.status(HttpCodes.OK).json(data);
    } catch (error) {
      return error;
    }
  });

  articlesRouter.put(`/:id`, rules.article(true), validate, async (req, res, next) => {
    const {id} = req.params;
    try {
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
    } catch (error) {
      return error;
    }
  });

  articlesRouter.get(`/articles/my`, async (req, res) => {
    const data = await api.articles.getAll();
    res.status(HttpCodes.OK).json(data);
  });

  articlesRouter.get(`/articles/search`, async (req, res) => {
    const {query} = req.query;
    let data = {};
    if (query) {
      data = await api.articles.searchByTitle(query);
    }
    res.status(HttpCodes.OK).json(data);
  });

  articlesRouter.get(`/articles/hot`, async (req, res) => {
    const data = await api.articles.getHotArticles();
    res.status(HttpCodes.OK).json(data);
  });

  return articlesRouter;
};

module.exports = router;
