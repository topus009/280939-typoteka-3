'use strict';

const {Router} = require(`express`);
const {HttpCodes} = require(`../../../../config/constants`);
const {validate, rules} = require(`../../validation`);
const {
  CustomError,
  catchAsync
} = require(`../../../utils/utils`);

const router = (api) => {
  const commentsRouter = new Router();

  commentsRouter.get(`/`, catchAsync(async (req, res) => {
    const data = await api.comments.getAll();
    return res.status(HttpCodes.OK).json(data);
  }));

  commentsRouter.get(`/article/:articleId`, catchAsync(async (req, res, next) => {
    const {articleId} = req.params;
    const data = await api.comments.getCommentsByArticleId(articleId);
    if (data instanceof CustomError) {
      return next(data);
    }
    return res.status(HttpCodes.OK).json(data);
  }));

  commentsRouter.get(`/article/:articleId/:id`, catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const data = await api.comments.findById(id);
    if (data instanceof CustomError) {
      return next(data);
    }
    return res.status(HttpCodes.OK).json(data);
  }));

  commentsRouter.post(`/article/:articleId`, rules.comment(), validate, catchAsync(async (req, res) => {
    const {articleId} = req.params;
    const data = await api.comments.add(articleId, req.body);
    return res.status(HttpCodes.OK).json(data);
  }));

  commentsRouter.delete(`/article/:articleId/:id`, catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const data = await api.comments.delete(id);
    if (data instanceof CustomError) {
      return next(data);
    }
    return res.status(HttpCodes.OK).json(data);
  }));

  commentsRouter.get(`/comments/my`, catchAsync(async (req, res) => {
    const data = await api.comments.getMyComments();
    return res.status(HttpCodes.OK).json(data);
  }));

  commentsRouter.get(`/comments/latest`, catchAsync(async (req, res) => {
    const data = await api.comments.getLatestComments();
    return res.status(HttpCodes.OK).json(data);
  }));

  return commentsRouter;
};

module.exports = router;
