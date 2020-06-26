'use strict';

const {Router} = require(`express`);
const {HttpCodes} = require(`../../../../../config/constants`);

const mainPageRouter = new Router();

const router = (api) => {
  mainPageRouter.get(`/`, (req, res) => {
    const users = api.users.getAll();
    const categories = api.categories.getAll();
    const posts = api.posts.getAll();
    const comments = api.comments.getAll();
    const lastComments = api.comments.getLatestComments();
    const mostPopularPosts = api.posts.getHotPosts();
    const categoriesCount = api.categories.getCategoriesCount();

    const data = {
      users,
      categories,
      posts,
      comments,
      lastComments,
      mostPopularPosts,
      categoriesCount,
    };

    res.status(HttpCodes.OK).json(data);
  });

  mainPageRouter.get(`/search`, (req, res) => {
    const {query} = req.query;

    const searchResults = api.posts.searchByTitle(query);

    const data = {
      query,
      searchResults,
    };

    res.status(HttpCodes.OK).json(data);
  });

  mainPageRouter.get(`/category/:id`, (req, res) => {
    const {id} = req.params;

    const posts = api.posts.getPostsByCategoryId(id);
    const categories = api.categories.getAll();
    const categoriesCount = api.categories.getCategoriesCount();
    const comments = api.comments.getAll();

    const data = {
      categories,
      posts,
      comments,
      categoriesCount,
      activeCategoryId: id,
    };

    res.status(HttpCodes.OK).json(data);
  });

  return mainPageRouter;
};

module.exports = router;
