'use strict';

const {Router} = require(`express`);
const {HttpCodes} = require(`../../../../../config/constants`);

const router = (Api) => {
  const commentsRouter = new Router();

  commentsRouter.get(`/`, (req, res) => {
    const data = Api.comments.getAll();
    res.status(HttpCodes.OK).json(data);
  });

  commentsRouter.get(`/post/:postId`, (req, res) => {
    const {postId} = req.params;
    const data = Api.comments.getCommentsByPostId(postId);
    res.status(HttpCodes.OK).json(data);
  });

  commentsRouter.get(`/post/:postId/:id`, (req, res) => {
    const {postId, id} = req.params;
    const data = Api.comments.findById(postId, id);
    res.status(HttpCodes.OK).json(data);
  });

  commentsRouter.post(`/post/:postId`, (req, res) => {
    const {postId} = req.params;
    const body = req.body;
    const data = Api.comments.add(postId, body);
    res.status(HttpCodes.OK).json(data);
  });

  commentsRouter.delete(`/post/:postId/:id`, (req, res) => {
    const {postId, id} = req.params;
    const data = Api.comments.delete(postId, id);
    res.status(HttpCodes.OK).json(data);
  });

  commentsRouter.get(`/comments/my`, (req, res) => {
    const data = Api.comments.getMyComments();
    res.status(HttpCodes.OK).json(data);
  });

  commentsRouter.get(`/comments/latest`, (req, res) => {
    const data = Api.comments.getLatestComments();
    res.status(HttpCodes.OK).json(data);
  });

  return commentsRouter;
};

module.exports = router;
