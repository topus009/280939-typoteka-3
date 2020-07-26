'use strict';

const {Router} = require(`express`);
const {HttpCodes} = require(`../../../../config/constants`);

const mainPageRouter = new Router();

const router = (api) => {
  mainPageRouter.get(`/`, (req, res) => {
    const users = api.users.getAll();
    const categories = api.categories.getAll();
    const articles = api.articles.getAll();
    const comments = api.comments.getAll();
    const lastComments = api.comments.getLatestComments();
    const mostPopularArticles = api.articles.getHotArticles();
    const categoriesCount = api.categories.getCategoriesCount();

    const data = {
      users,
      categories,
      articles,
      comments,
      lastComments,
      mostPopularArticles,
      categoriesCount,
    };

    res.status(HttpCodes.OK).json(data);
  });

  mainPageRouter.get(`/search`, (req, res) => {
    const {query} = req.query;

    const searchResults = api.articles.searchByTitle(query);

    const data = {
      query,
      searchResults,
    };

    res.status(HttpCodes.OK).json(data);
  });

  mainPageRouter.get(`/category/:id`, (req, res) => {
    const {id} = req.params;

    const articles = api.articles.getArticlesByCategoryId(id);
    const categories = api.categories.getAll();
    const categoriesCount = api.categories.getCategoriesCount();
    const comments = api.comments.getAll();

    const data = {
      categories,
      articles,
      comments,
      categoriesCount,
      activeCategoryId: id,
    };

    res.status(HttpCodes.OK).json(data);
  });

  return mainPageRouter;
};

module.exports = router;
