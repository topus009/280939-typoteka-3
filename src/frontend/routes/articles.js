'use strict';

const {Router} = require(`express`);
const axios = require(`../axios`);
const {articleImgUpload} = require(`../../utils/upload`);

const articlesRouter = new Router();

articlesRouter.get(`/article/:id`, async (req, res, next) => {
  try {
    const {id} = req.params;
    const {data} = await axios.get(`/pages/articles/article/${id}`);
    res.render(`pages/articles/article`, data);
  } catch (error) {
    next(error);
  }
});

articlesRouter.post(`/article/:id`, async (req, res, next) => {
  const {id} = req.params;
  try {
    const apiReq = await axios.post(`/comments/article/${id}`, req.body);
    if (apiReq.status === 200) {
      res.redirect(`/my/comments`);
    }
  } catch (error) {
    if (error.statusCode === 400 && Array.isArray(error.text)) {
      const {data} = await axios.get(`/pages/articles/article/${id}`);
      res.render(`pages/articles/article`, {...data, errors: error.text});
      return;
    }
    next(error);
  }
});

articlesRouter.get(`/article/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const {data} = await axios.get(`/pages/articles/article/edit/${id}`);
  res.render(`pages/articles/article-form`, data);
});

articlesRouter.post(`/article/edit/:id`, articleImgUpload, async (req, res, next) => {
  const {id} = req.params;
  const articleData = req.body;
  if (req.file) {
    articleData.file = req.file;
  }
  try {
    const apiReq = await axios.put(`/articles/${id}`, articleData);
    if (apiReq.status === 200) {
      res.redirect(`/my/articles`);
    }
  } catch (error) {
    if (error.statusCode === 400 && Array.isArray(error.text)) {
      const {data} = await axios.get(`/pages/articles/article/edit/${id}`);
      const prevarticleData = {
        ...data,
        article: {
          ...data.article,
          ...articleData,
        },
        errors: error.text
      };
      res.render(`pages/articles/article-form`, prevarticleData);
      return;
    }
    next(error);
  }
});

articlesRouter.get(`/add`, async (req, res) => {
  const {data} = await axios.get(`/pages/articles/add`);
  res.render(`pages/articles/article-form`, data);
});

articlesRouter.post(`/add`, articleImgUpload, async (req, res, next) => {
  const articleData = req.body;
  if (req.file) {
    articleData.file = req.file;
  }
  try {
    const apiReq = await axios.post(`/articles`, articleData);
    if (apiReq.status === 200) {
      res.redirect(`/my/articles`);
    }
  } catch (error) {
    if (error.statusCode === 400 && Array.isArray(error.text)) {
      const {data} = await axios.get(`/pages/articles/add`);
      const prevarticleData = {
        ...data,
        article: {
          ...data.article,
          ...articleData,
        },
        errors: error.text
      };
      res.render(`pages/articles/article-form`, prevarticleData);
      return;
    }
    next(error);
  }
});

module.exports = articlesRouter;
