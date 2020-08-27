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
    res.status(HttpCodes.OK).json({categories});
    return;
  }));

  myPageRouter.get(`/comments`, catchAsync(async (req, res) => {
    const [
      comments,
      articles,
      myComments,
    ] = await Promise.all([
      api.comments.getAll(),
      api.articles.getAll(),
      api.comments.getMy(),
      api.users.findById(ADMIN_ID),
    ]);
    const data = {
      comments,
      articles,
      myComments,
    };
    res.status(HttpCodes.OK).json(data);
    return;
  }));

  myPageRouter.get(`/articles`, catchAsync(async (req, res) => {
    const articles = await api.articles.getAll();
    res.status(HttpCodes.OK).json({articles});
    return;
  }));
  return myPageRouter;
};

module.exports = router;
