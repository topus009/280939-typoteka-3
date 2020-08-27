'use strict';

const {Router} = require(`express`);
const {HttpCodes} = require(`../../../../config/constants`);
const {catchAsync} = require(`../../../utils/utils`);
const {
  validationMiddleware,
  rulesMiddleware,
} = require(`../../validation`);

const commentsRouter = new Router();

const router = (api) => {
  commentsRouter.get(`/`, catchAsync(async (req, res) => {
    const data = await api.comments.getAll();
    res.status(HttpCodes.OK).json(data);
    return;
  }));

  commentsRouter.get(`/article/:articleId`, catchAsync(async (req, res) => {
    const {articleId} = req.params;
    const data = await api.comments.getAllByArticleId(articleId);
    res.status(HttpCodes.OK).json(data);
    return;
  }));

  commentsRouter.get(`/article/:articleId/:id`, catchAsync(async (req, res) => {
    const {id} = req.params;
    const data = await api.comments.findById(id);
    res.status(HttpCodes.OK).json(data);
    return;
  }));

  commentsRouter.post(`/article/:articleId`, [
    rulesMiddleware.comment(),
    validationMiddleware,
  ], catchAsync(async (req, res) => {
    const {articleId} = req.params;
    const data = await api.comments.add(articleId, req.body);
    res.status(HttpCodes.OK).json(data);
    return;
  }));

  commentsRouter.delete(`/article/:articleId/:id`, catchAsync(async (req, res) => {
    const {id} = req.params;
    const data = await api.comments.delete(id);
    res.status(HttpCodes.OK).json(data);
    return;
  }));

  commentsRouter.get(`/comments/my`, catchAsync(async (req, res) => {
    const data = await api.comments.getMy();
    res.status(HttpCodes.OK).json(data);
    return;
  }));

  commentsRouter.get(`/comments/latest`, catchAsync(async (req, res) => {
    const data = await api.comments.getLatest();
    res.status(HttpCodes.OK).json(data);
    return;
  }));
  return commentsRouter;
};

module.exports = router;
