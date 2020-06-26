'use strict';

const {Router} = require(`express`);
const {HttpCodes} = require(`../../../../../config/constants`);
const {validate, rules} = require(`../../validation`);

const router = (api) => {
  const commentsRouter = new Router();

  commentsRouter.get(`/`, (req, res) => {
    const data = api.comments.getAll();
    res.status(HttpCodes.OK).json(data);
  });

  commentsRouter.get(`/post/:postId`, (req, res) => {
    const {postId} = req.params;
    const data = api.comments.getCommentsByPostId(postId);
    res.status(HttpCodes.OK).json(data);
  });

  commentsRouter.get(`/post/:postId/:id`, (req, res) => {
    const {postId, id} = req.params;
    const data = api.comments.findById(postId, id);
    res.status(HttpCodes.OK).json(data);
  });

  commentsRouter.post(`/post/:postId`, rules.comment(), validate, (req, res) => {
    const {postId} = req.params;
    const data = api.comments.add(postId, req.body);
    res.status(HttpCodes.OK).json(data);
  });

  commentsRouter.delete(`/post/:postId/:id`, (req, res) => {
    const {postId, id} = req.params;
    const data = api.comments.delete(postId, id);
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
