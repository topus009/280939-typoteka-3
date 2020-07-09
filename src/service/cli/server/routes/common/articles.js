'use strict';

const path = require(`path`);
const fsFromises = require(`fs`).promises;
const {Router} = require(`express`);
const {HttpCodes} = require(`../../../../../config/constants`);
const {isFileExistsAsync} = require(`../../../../../utils/utils`);
const {validate, rules} = require(`../../validation`);

const router = (api) => {
  const articlesRouter = new Router();

  articlesRouter.get(`/`, (req, res) => {
    const data = api.articles.getAll();
    res.status(HttpCodes.OK).json(data);
  });

  articlesRouter.get(`/:id`, (req, res) => {
    const {id} = req.params;
    const data = api.articles.findById(id);
    res.status(HttpCodes.OK).json(data);
  });

  articlesRouter.get(`/categories/:categoryId`, (req, res) => {
    const {categoryId} = req.params;
    const data = api.articles.getArticlesByCategoryId(categoryId);
    res.status(HttpCodes.OK).json(data);
  });

  articlesRouter.post(`/`, rules.article(), validate, async (req, res) => {
    if (req.body.file) {
      const {file} = req.body;
      const backendImgPath = `img/articles/${file.filename}`;
      await fsFromises.rename(file.path, path.join(process.cwd(), `./src/express/public/${backendImgPath}`));
      delete req.body.file;
      req.body.img = backendImgPath;
    }
    const data = api.articles.add(req.body);
    res.status(HttpCodes.OK).json(data);
  });

  articlesRouter.delete(`/:id`, (req, res) => {
    const {id} = req.params;
    const data = api.articles.delete(id);
    res.status(HttpCodes.OK).json(data);
  });

  articlesRouter.put(`/:id`, rules.article(), validate, async (req, res) => {
    const {id} = req.params;
    if (req.body.file) {
      const {file} = req.body;
      const backendImgPath = `img/articles/${file.filename}`;
      const pathToDataBase = path.join(process.cwd(), `./src/express/public/`);
      const prevArticle = api.articles.findById(id);
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
    const data = api.articles.edit(id, req.body);
    res.status(HttpCodes.OK).json(data);
  });

  articlesRouter.get(`/articles/my`, (req, res) => {
    const data = api.articles.getAll();
    res.status(HttpCodes.OK).json(data);
  });

  articlesRouter.get(`/articles/search`, (req, res) => {
    const {query} = req.query;
    let data = {};
    if (query) {
      data = api.articles.searchByTitle(query);
    }
    res.status(HttpCodes.OK).json(data);
  });

  articlesRouter.get(`/articles/hot`, (req, res) => {
    const data = api.articles.getHotArticles();
    res.status(HttpCodes.OK).json(data);
  });

  return articlesRouter;
};

module.exports = router;
