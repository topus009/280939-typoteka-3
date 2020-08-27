'use strict';

const {Router} = require(`express`);
const {
  UsersRoles,
  HttpCodes,
} = require(`../../../config/constants`);
const {
  articleImgUploadMiddleware,
  addFile,
} = require(`../../utils/upload`);
const {catchAsync} = require(`../../utils/utils`);
const {
  authMiddleware,
  adminMiddleware,
  csrfMiddleware,
} = require(`../utils/utils`);
const axios = require(`../axios`);

const articlesRouter = new Router();

articlesRouter.get(`/article/:id`, [
  csrfMiddleware,
], catchAsync(async (req, res) => {
  const {id} = req.params;
  const {data} = await axios.get(`/pages/articles/article/${id}`);
  res.render(`pages/articles/article`, {
    ...data,
    csrf: req.csrfToken(),
  });
  return;
}));

articlesRouter.post(`/article/:id`, [
  authMiddleware,
  csrfMiddleware,
], async (req, res, next) => {
  const {id} = req.params;
  const {currentUser: {id: userId, role: role}} = res.locals;
  try {
    const apiReq = await axios.post(`/comments/article/${id}`, {
      ...req.body,
      userId,
    });
    if (apiReq.status === HttpCodes.OK) {
      res.redirect(role === UsersRoles.ADMIN ? `/my/comments` : req.originalUrl);
    }
    return;
  } catch (error) {
    if (error.statusCode === HttpCodes.BAD_REQUEST && Array.isArray(error.text)) {
      const {data} = await axios.get(`/pages/articles/article/${id}`);
      res.render(`pages/articles/article`, {
        ...data,
        errors: error.text,
        csrf: req.csrfToken(),
      });
      return;
    }
    next(error);
  }
});

articlesRouter.get(`/article/edit/:id`, [
  authMiddleware,
  adminMiddleware,
  csrfMiddleware,
], catchAsync(async (req, res) => {
  const {id} = req.params;
  const {data} = await axios.get(`/pages/articles/article/edit/${id}`);
  res.render(`pages/articles/article-form`, {
    ...data,
    csrf: req.csrfToken(),
  });
  return;
}));

articlesRouter.post(`/article/edit/:id`, [
  authMiddleware,
  adminMiddleware,
  articleImgUploadMiddleware,
  csrfMiddleware,
], async (req, res, next) => {
  const {id} = req.params;
  addFile(req, req.body);
  try {
    const apiReq = await axios.put(`/articles/${id}`, req.body);
    if (apiReq.status === HttpCodes.OK) {
      res.redirect(`/my/articles`);
    }
    return;
  } catch (error) {
    if (error.statusCode === HttpCodes.BAD_REQUEST && Array.isArray(error.text)) {
      const {data} = await axios.get(`/pages/articles/article/edit/${id}`);
      res.render(`pages/articles/article-form`, {
        ...data,
        article: {
          ...data.article,
          ...req.body,
        },
        errors: error.text,
        csrf: req.csrfToken(),
      });
      return;
    }
    next(error);
  }
});

articlesRouter.get(`/add`, [
  authMiddleware,
  adminMiddleware,
  csrfMiddleware,
], catchAsync(async (req, res) => {
  const {data} = await axios.get(`/pages/articles/add`);
  res.render(`pages/articles/article-form`, {
    ...data,
    csrf: req.csrfToken(),
  });
  return;
}));

articlesRouter.post(`/add`, [
  authMiddleware,
  adminMiddleware,
  articleImgUploadMiddleware,
  csrfMiddleware,
], async (req, res, next) => {
  const articleData = req.body;
  addFile(req, articleData);
  try {
    const apiReq = await axios.post(`/articles`, articleData);
    if (apiReq.status === HttpCodes.OK) {
      res.redirect(`/my/articles`);
    }
  } catch (error) {
    if (error.statusCode === HttpCodes.BAD_REQUEST && Array.isArray(error.text)) {
      const {data} = await axios.get(`/pages/articles/add`);
      const prevArticleData = {
        ...data,
        article: {
          ...data.article,
          ...articleData,
        },
        errors: error.text,
      };
      res.render(`pages/articles/article-form`, {
        ...prevArticleData,
        csrf: req.csrfToken(),
      });
      return;
    }
    next(error);
  }
});

module.exports = articlesRouter;
