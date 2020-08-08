'use strict';

const {Router} = require(`express`);
const {HttpCodes} = require(`../../../../config/constants`);
const {
  getPaginationData,
  catchAsync,
} = require(`../../../utils/utils`);

const mainPageRouter = new Router();

const router = (api) => {
  mainPageRouter.get(`/`, catchAsync(async (req, res) => {
    const page = req.query.page || 1;
    const [
      users,
      categories,
      articles,
      comments,
      lastComments,
      mostPopularArticles,
      categoriesCount,
      articlesTotalCount,
    ] = await Promise.all([
      api.users.getAll(),
      api.categories.getAll(),
      api.articles.getArticlesByPage(page),
      api.comments.getAll(),
      api.comments.getLatestComments(),
      api.articles.getHotArticles(),
      api.categories.getCategoriesCount(),
      api.articles.getTotalCount(),
    ]);

    const data = {
      users,
      categories,
      articles,
      comments,
      lastComments,
      mostPopularArticles,
      categoriesCount,
      ...getPaginationData({articlesTotalCount, page}),
    };

    return res.status(HttpCodes.OK).json(data);
  }));

  mainPageRouter.get(`/search`, catchAsync(async (req, res) => {
    const {query} = req.query;

    const searchResults = await api.articles.searchByTitle(query);

    const data = {
      query,
      searchResults,
    };

    return res.status(HttpCodes.OK).json(data);
  }));

  mainPageRouter.get(`/category/:id`, catchAsync(async (req, res) => {
    const {id} = req.params;
    const page = req.query.page || 1;
    const articles = await api.articles.getArticlesByCategoryId(id, page);
    const [
      categories,
      categoriesCount,
      comments,
      articlesTotalCount,
    ] = await Promise.all([
      api.categories.getAll(),
      api.categories.getCategoriesCount(),
      api.comments.getAll(),
      api.articles.getTotalCount(+id),
    ]);

    const data = {
      categories,
      articles,
      comments,
      categoriesCount,
      activeCategoryId: id,
      ...getPaginationData({articlesTotalCount, page}),
    };

    return res.status(HttpCodes.OK).json(data);
  }));

  return mainPageRouter;
};

module.exports = router;
