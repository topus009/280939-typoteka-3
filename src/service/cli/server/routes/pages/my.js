'use strict';

const {Router} = require(`express`);
const {HttpCodes, MY_NAME} = require(`../../../../../config/constants`);

const myPageRouter = new Router();

const router = (Api) => {
  myPageRouter.get(`/categories`, (req, res) => {
    const categories = Api.categories.getAll();
    const myCategories = Api.categories.getMyCategories();

    const data = {
      categories,
      myCategories,
    };

    res.status(HttpCodes.OK).json(data);
  });

  myPageRouter.get(`/comments`, (req, res) => {
    const comments = Api.comments.getAll();
    const posts = Api.posts.getAll();
    const myComments = Api.comments.getMyComments();
    const currentUser = Api.users.getUserByName(MY_NAME);

    const data = {
      comments,
      posts,
      myComments,
      currentUser,
    };

    res.status(HttpCodes.OK).json(data);
  });

  myPageRouter.get(`/posts`, (req, res) => {
    const posts = Api.posts.getAll();
    const myPosts = Api.posts.getMyPosts();

    const data = {
      posts,
      myPosts,
    };

    res.status(HttpCodes.OK).json(data);
  });

  return myPageRouter;
};

module.exports = router;
