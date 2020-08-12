'use strict';

const {Router} = require(`express`);
const axios = require(`../axios`);
const {
  articleImgUpload,
  addFile,
} = require(`../../utils/upload`);
const {catchAsync} = require(`../../utils/utils`);
const {UsersRoles} = require(`../../../config/constants`);
const {
  auth,
  admin,
} = require(`../utils/utils`);

const articlesRouter = new Router();

articlesRouter.get(`/article/:id`, catchAsync(async (req, res) => {
  const {id} = req.params;
  const {data} = await axios.get(`/pages/articles/article/${id}`);
  return res.render(`pages/articles/article`, data);
}));

articlesRouter.post(`/article/:id`, [auth], async (req, res, next) => {
  const {id} = req.params;
  const {currentUser} = res.locals;
  const userId = currentUser.id;
  const role = currentUser.role;
  try {
    const apiReq = await axios.post(`/comments/article/${id}`, {...req.body, userId});
    if (apiReq.status === 200) {
      const url = role === UsersRoles.ADMIN ? `/my/comments` : req.originalUrl;
      res.redirect(url);
    }
    return;
  } catch (error) {
    if (error.statusCode === 400 && Array.isArray(error.text)) {
      const {data} = await axios.get(`/pages/articles/article/${id}`);
      res.render(`pages/articles/article`, {...data, errors: error.text});
      return;
    }
    next(error);
  }
});

articlesRouter.get(`/article/edit/:id`, [auth, admin], catchAsync(async (req, res) => {
  const {id} = req.params;
  const {data} = await axios.get(`/pages/articles/article/edit/${id}`);
  return res.render(`pages/articles/article-form`, data);
}));

articlesRouter.post(`/article/edit/:id`, [auth, admin, articleImgUpload], async (req, res, next) => {
  const {id} = req.params;
  const articleData = req.body;
  addFile(req, articleData);
  try {
    const apiReq = await axios.put(`/articles/${id}`, articleData);
    if (apiReq.status === 200) {
      res.redirect(`/my/articles`);
    }
    return;
  } catch (error) {
    if (error.statusCode === 400 && Array.isArray(error.text)) {
      const {data} = await axios.get(`/pages/articles/article/edit/${id}`);
      const prevArticleData = {
        ...data,
        article: {
          ...data.article,
          ...articleData,
        },
        errors: error.text
      };
      res.render(`pages/articles/article-form`, prevArticleData);
      return;
    }
    next(error);
  }
});

articlesRouter.get(`/add`, [auth, admin], catchAsync(async (req, res) => {
  const {data} = await axios.get(`/pages/articles/add`);
  return res.render(`pages/articles/article-form`, data);
}));

articlesRouter.post(`/add`, [auth, admin, articleImgUpload], async (req, res, next) => {
  const articleData = req.body;
  addFile(req, articleData);
  try {
    const apiReq = await axios.post(`/articles`, articleData);
    if (apiReq.status === 200) {
      res.redirect(`/my/articles`);
    }
  } catch (error) {
    if (error.statusCode === 400 && Array.isArray(error.text)) {
      const {data} = await axios.get(`/pages/articles/add`);
      const prevArticleData = {
        ...data,
        article: {
          ...data.article,
          ...articleData,
        },
        errors: error.text
      };
      res.render(`pages/articles/article-form`, prevArticleData);
      return;
    }
    next(error);
  }
});

module.exports = articlesRouter;
