'use strict';

const {Router} = require(`express`);
const {HttpCodes} = require(`../../../../config/constants`);
const {validate, rules} = require(`../../validation`);

const router = (api) => {
  const commentsRouter = new Router();

  commentsRouter.get(`/`, (req, res) => {
    const data = api.comments.getAll();
    res.status(HttpCodes.OK).json(data);
  });

  commentsRouter.get(`/article/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const data = api.comments.getCommentsByArticleId(articleId);
    res.status(HttpCodes.OK).json(data);
  });

  commentsRouter.get(`/article/:articleId/:id`, (req, res) => {
    const {id} = req.params;
    const data = api.comments.findById(id);
    res.status(HttpCodes.OK).json(data);
  });

  commentsRouter.post(`/article/:articleId`, rules.comment(), validate, (req, res) => {
    const {articleId} = req.params;
    const data = api.comments.add(articleId, req.body);
    res.status(HttpCodes.OK).json(data);
  });

  commentsRouter.delete(`/article/:articleId/:id`, (req, res) => {
    const {id} = req.params;
    const data = api.comments.delete(id);
    res.status(HttpCodes.OK).json(data);
  });

  commentsRouter.get(`/comments/my`, (req, res) => {
    const data = api.comments.getMyComments();
    res.status(HttpCodes.OK).json(data);
  });

  commentsRouter.get(`/comments/latest`, (req, res) => {
    const data = api.comments.getLatestComments();
    res.status(HttpCodes.OK).json(data);
  });

  return commentsRouter;
};

module.exports = router;
