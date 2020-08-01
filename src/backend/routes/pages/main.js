'use strict';

const {Router} = require(`express`);
const {HttpCodes} = require(`../../../../config/constants`);
const {CustomError} = require(`../../../utils/utils`);

const mainPageRouter = new Router();

const router = (api) => {
  mainPageRouter.get(`/`, async (req, res) => {
    try {
      const [
        users,
        categories,
        articles,
        comments,
        lastComments,
        mostPopularArticles,
        categoriesCount,
      ] = await Promise.all([
        api.users.getAll(),
        api.categories.getAll(),
        api.articles.getAll(),
        api.comments.getAll(),
        api.comments.getLatestComments(),
        api.articles.getHotArticles(),
        api.categories.getCategoriesCount(),
      ]);

      const data = {
        users,
        categories,
        articles,
        comments,
        lastComments,
        mostPopularArticles,
        categoriesCount,
      };

      return res.status(HttpCodes.OK).json(data);
    } catch (error) {
      return error;
    }
  });

  mainPageRouter.get(`/search`, async (req, res) => {
    try {
      const {query} = req.query;

      const searchResults = await api.articles.searchByTitle(query);

      const data = {
        query,
        searchResults,
      };

      return res.status(HttpCodes.OK).json(data);
    } catch (error) {
      return error;
    }
  });

  mainPageRouter.get(`/category/:id`, async (req, res, next) => {
    const {id} = req.params;
    try {
      const articles = await api.articles.getArticlesByCategoryId(id);
      if (articles instanceof CustomError) {
        next(articles);
      }
      const [
        categories,
        categoriesCount,
        comments,
      ] = await Promise.all([
        api.categories.getAll(),
        api.categories.getCategoriesCount(),
        api.comments.getAll(),
      ]);

      const data = {
        categories,
        articles,
        comments,
        categoriesCount,
        activeCategoryId: id,
      };

      return res.status(HttpCodes.OK).json(data);
    } catch (error) {
      return error;
    }
  });

  return mainPageRouter;
};

module.exports = router;
