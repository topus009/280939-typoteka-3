'use strict';

const {Router} = require(`express`);
const {
  HttpCodes,
  ADMIN_ID,
} = require(`../../../../config/constants`);
const {catchAsync} = require(`../../../utils/utils`);

const myPageRouter = new Router();

const router = (api) => {
  myPageRouter.get(`/categories`, catchAsync(async (req, res) => {
    const categories = await api.categories.getAll();

    return res.status(HttpCodes.OK).json({categories});
  }));

  myPageRouter.get(`/comments`, catchAsync(async (req, res) => {
    const [
      comments,
      articles,
      myComments,
    ] = await Promise.all([
      api.comments.getAll(),
      api.articles.getAll(),
      api.comments.getMyComments(),
      api.users.findById(ADMIN_ID),
    ]);

    const data = {
      comments,
      articles,
      myComments,
    };

    return res.status(HttpCodes.OK).json(data);
  }));

  myPageRouter.get(`/articles`, catchAsync(async (req, res) => {
    const articles = await api.articles.getAll();

    return res.status(HttpCodes.OK).json({articles});
  }));

  return myPageRouter;
};

module.exports = router;
