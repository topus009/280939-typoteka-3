'use strict';

const {Router} = require(`express`);
const dayjs = require(`dayjs`);
const {
  HttpCodes,
  MY_NAME,
} = require(`../../../../config/constants`);
const {
  CustomError,
  catchAsync,
} = require(`../../../utils/utils`);

const articlesPageRouter = new Router();

const router = (api) => {
  articlesPageRouter.get(`/article/:id`, catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const article = await api.articles.findById(id);
    if (article instanceof CustomError) {
      next(article);
    }
    const [
      categories,
      users,
      currentUser,
      categoriesCount,
      comments,
    ] = await Promise.all([
      api.categories.getAll(),
      api.users.getAll(),
      api.users.getUserByName(MY_NAME),
      api.categories.getCategoriesCount(),
      api.comments.getCommentsByArticleId(id),
    ]);
    const data = {
      categories,
      currentUser,
      article,
      users,
      categoriesCount,
      comments,
    };
    return res.status(HttpCodes.OK).json(data);
  }));

  articlesPageRouter.get(`/article/edit/:id`, catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const article = await api.articles.findById(id);
    if (article instanceof CustomError) {
      next(article);
    }
    const categories = await api.categories.getAll();
    const data = {
      categories,
      article
    };

    return res.status(HttpCodes.OK).json(data);
  }));

  articlesPageRouter.get(`/add`, catchAsync(async (req, res) => {
    const categories = await api.categories.getAll();

    const data = {
      categories,
      isNew: true,
      article: {
        createdDate: dayjs().format(`DD.MM.YYYY`)
      }
    };

    return res.status(HttpCodes.OK).json(data);
  }));

  return articlesPageRouter;
};

module.exports = router;
