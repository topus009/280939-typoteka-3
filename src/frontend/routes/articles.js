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
  csrf,
} = require(`../utils/utils`);

const articlesRouter = new Router();

articlesRouter.get(`/article/:id`, [csrf], catchAsync(async (req, res) => {
  const {id} = req.params;
  const {data} = await axios.get(`/pages/articles/article/${id}`);
  return res.render(`pages/articles/article`, {
    ...data,
    csrf: req.csrfToken()
  });
}));

articlesRouter.post(`/article/:id`, [auth, csrf], async (req, res, next) => {
  const {id} = req.params;
  const {currentUser} = res.locals;
  const userId = currentUser.id;
  const role = currentUser.role;
  try {
    const apiReq = await axios.post(`/comments/article/${id}`, {
      ...req.body,
      userId
    });
    if (apiReq.status === 200) {
      const url = role === UsersRoles.ADMIN ? `/my/comments` : req.originalUrl;
      res.redirect(url);
    }
    return;
  } catch (error) {
    if (error.statusCode === 400 && Array.isArray(error.text)) {
      const {data} = await axios.get(`/pages/articles/article/${id}`);
      res.render(`pages/articles/article`, {
        ...data,
        errors: error.text,
        csrf: req.csrfToken()
      });
      return;
    }
    next(error);
  }
});

articlesRouter.get(`/article/edit/:id`, [
  auth,
  admin,
  csrf,
], catchAsync(async (req, res) => {
  const {id} = req.params;
  const {data} = await axios.get(`/pages/articles/article/edit/${id}`);
  return res.render(`pages/articles/article-form`, {
    ...data,
    csrf: req.csrfToken()
  });
}));

articlesRouter.post(`/article/edit/:id`, [
  auth,
  admin,
  csrf,
  articleImgUpload,
], async (req, res, next) => {
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
      res.render(`pages/articles/article-form`, {
        ...prevArticleData,
        csrf: req.csrfToken()
      });
      return;
    }
    next(error);
  }
});

articlesRouter.get(`/add`, [auth, admin, csrf], catchAsync(async (req, res) => {
  const {data} = await axios.get(`/pages/articles/add`);
  return res.render(`pages/articles/article-form`, {
    ...data,
    csrf: req.csrfToken()
  });
}));

articlesRouter.post(`/add`, [
  auth,
  admin,
  csrf,
  articleImgUpload,
], async (req, res, next) => {
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
      res.render(`pages/articles/article-form`, {
        ...prevArticleData,
        csrf: req.csrfToken()
      });
      return;
    }
    next(error);
  }
});

module.exports = articlesRouter;
