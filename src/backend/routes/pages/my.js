'use strict';

const {Router} = require(`express`);
const {HttpCodes, MY_NAME} = require(`../../../../config/constants`);

const myPageRouter = new Router();

const router = (api) => {
  myPageRouter.get(`/categories`, async (req, res) => {
    const categories = await api.categories.getAll();

    return res.status(HttpCodes.OK).json({categories});
  });

  myPageRouter.get(`/comments`, async (req, res) => {
    const [
      comments,
      articles,
      myComments,
      currentUser,
    ] = await Promise.all([
      api.comments.getAll(),
      api.articles.getAll(),
      api.comments.getMyComments(),
      api.users.getUserByName(MY_NAME),
    ]);

    const data = {
      comments,
      articles,
      myComments,
      currentUser,
    };

    return res.status(HttpCodes.OK).json(data);
  });

  myPageRouter.get(`/articles`, async (req, res) => {
    const articles = await api.articles.getAll();

    return res.status(HttpCodes.OK).json({articles});
  });

  return myPageRouter;
};

module.exports = router;
