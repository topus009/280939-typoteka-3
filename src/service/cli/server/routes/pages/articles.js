'use strict';

const {Router} = require(`express`);
const dayjs = require(`dayjs`);
const {HttpCodes, MY_NAME} = require(`../../../../../config/constants`);

const articlesPageRouter = new Router();

const router = (api) => {
  articlesPageRouter.get(`/article/:id`, (req, res) => {
    const {id} = req.params;

    const article = api.articles.findById(id);
    const categories = api.categories.getAll();
    const users = api.users.getAll();
    const currentUser = api.users.getUserByName(MY_NAME);
    const categoriesCount = api.categories.getCategoriesCount();
    const comments = api.comments.getCommentsByArticleId(id);

    const data = {
      categories,
      currentUser,
      article,
      users,
      categoriesCount,
      comments,
    };

    res.status(HttpCodes.OK).json(data);
  });

  articlesPageRouter.get(`/article/:id/edit`, (req, res) => {
    const {id} = req.params;
    const article = api.articles.findById(id);
    const categories = api.categories.getAll();

    const data = {
      categories,
      article
    };

    res.status(HttpCodes.OK).json(data);
  });

  articlesPageRouter.get(`/new`, (req, res) => {
    const categories = api.categories.getAll();

    const data = {
      categories,
      isNew: true,
      article: {
        createdDate: dayjs().format(`DD.MM.YYYY`)
      }
    };

    res.status(HttpCodes.OK).json(data);
  });

  return articlesPageRouter;
};

module.exports = router;
