'use strict';

const {Router} = require(`express`);
const {HttpCodes, MY_NAME} = require(`../../../../../config/constants`);

const myPageRouter = new Router();

const router = (api) => {
  myPageRouter.get(`/categories`, (req, res) => {
    const categories = api.categories.getAll();

    res.status(HttpCodes.OK).json({categories});
  });

  myPageRouter.get(`/comments`, (req, res) => {
    const comments = api.comments.getAll();
    const posts = api.posts.getAll();
    const myComments = api.comments.getMyComments();
    const currentUser = api.users.getUserByName(MY_NAME);

    const data = {
      comments,
      posts,
      myComments,
      currentUser,
    };

    res.status(HttpCodes.OK).json(data);
  });

  myPageRouter.get(`/posts`, (req, res) => {
    const posts = api.posts.getAll();

    res.status(HttpCodes.OK).json({posts});
  });

  return myPageRouter;
};

module.exports = router;
