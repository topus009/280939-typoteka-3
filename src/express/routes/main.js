'use strict';

const {Router} = require(`express`);
const Api = require(`../api/api`);

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  const users = await Api.users.getAll();
  const categories = await Api.categories.getAll();
  const posts = await Api.posts.getAll();
  const comments = await Api.comments.getAll();
  const lastComments = await Api.comments.getLatestComments();
  const mostPopularPosts = await Api.posts.getHotPosts();
  const categoriesCount = await Api.categories.getCategoriesCount();

  res.render(`pages/main/main`, {
    posts,
    categories,
    comments,
    users,
    mostPopularPosts,
    lastComments,
    categoriesCount,
  });
});

mainRouter.get(`/search`, async (req, res) => {
  const query = req.query.query;

  if (query) {
    const searchResults = await Api.posts.searchByTitle(query);
    res.render(`pages/main/search`, {searchResults, query});
  } else {
    res.render(`pages/main/search`);
  }
});

mainRouter.get(`/category/:id`, async (req, res) => {
  const {id} = req.params;

  const categories = await Api.categories.getAll();
  const posts = await Api.posts.getPostsByCategoryId(id);
  const comments = await Api.comments.getAll();
  const categoriesCount = await Api.categories.getCategoriesCount();

  res.render(`pages/main/category`, {
    posts,
    comments,
    categories,
    activeCategoryId: id,
    categoriesCount,
  });
});

module.exports = mainRouter;
