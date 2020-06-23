'use strict';

const {Router} = require(`express`);
const {HttpCodes} = require(`../../../../../config/constants`);

const mainPageRouter = new Router();

const router = (Api) => {
  mainPageRouter.get(`/`, (req, res) => {
    const users = Api.users.getAll();
    const categories = Api.categories.getAll();
    const posts = Api.posts.getAll();
    const comments = Api.comments.getAll();
    const lastComments = Api.comments.getLatestComments();
    const mostPopularPosts = Api.posts.getHotPosts();
    const categoriesCount = Api.categories.getCategoriesCount();

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

    const searchResults = Api.posts.searchByTitle(query);

    const data = {
      query,
      searchResults,
    };

    res.status(HttpCodes.OK).json(data);
  });

  mainPageRouter.get(`/category/:id`, (req, res) => {
    const {id} = req.params;

    const posts = Api.posts.getPostsByCategoryId(id);
    const categories = Api.categories.getAll();
    const categoriesCount = Api.categories.getCategoriesCount();
    const comments = Api.comments.getAll();

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
