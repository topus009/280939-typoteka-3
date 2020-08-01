'use strict';

const {Router} = require(`express`);
const {HttpCodes} = require(`../../../../config/constants`);
const {validate, rules} = require(`../../validation`);
const {CustomError} = require(`../../../utils/utils`);

const router = (api) => {
  const commentsRouter = new Router();

  commentsRouter.get(`/`, async (req, res) => {
    const data = await api.comments.getAll();
    res.status(HttpCodes.OK).json(data);
  });

  commentsRouter.get(`/article/:articleId`, async (req, res, next) => {
    const {articleId} = req.params;
    try {
      const data = await api.comments.getCommentsByArticleId(articleId);
      if (data instanceof CustomError) {
        return next(data);
      }
      return res.status(HttpCodes.OK).json(data);
    } catch (error) {
      return error;
    }
  });

  commentsRouter.get(`/article/:articleId/:id`, async (req, res, next) => {
    const {id} = req.params;
    try {
      const data = await api.comments.findById(id);
      if (data instanceof CustomError) {
        return next(data);
      }
      return res.status(HttpCodes.OK).json(data);
    } catch (error) {
      return error;
    }

  });

  commentsRouter.post(`/article/:articleId`, rules.comment(), validate, async (req, res) => {
    const {articleId} = req.params;
    const data = await api.comments.add(articleId, req.body);
    res.status(HttpCodes.OK).json(data);
  });

  commentsRouter.delete(`/article/:articleId/:id`, async (req, res, next) => {
    const {id} = req.params;
    try {
      const data = await api.comments.delete(id);
      if (data instanceof CustomError) {
        return next(data);
      }
      return res.status(HttpCodes.OK).json(data);
    } catch (error) {
      return error;
    }
  });

  commentsRouter.get(`/comments/my`, async (req, res) => {
    const data = await api.comments.getMyComments();
    res.status(HttpCodes.OK).json(data);
  });

  commentsRouter.get(`/comments/latest`, async (req, res) => {
    const data = await api.comments.getLatestComments();
    res.status(HttpCodes.OK).json(data);
  });

  return commentsRouter;
};

module.exports = router;
