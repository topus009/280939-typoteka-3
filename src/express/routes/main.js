'use strict';

const {Router} = require(`express`);
const Api = require(`../api/api`);

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  const [
    users,
    categories,
    posts,
    comments,
    lastComments,
    mostPopularPosts,
    categoriesCount,
  ] = await Promise.all([
    Api.users.getAll(),
    Api.categories.getAll(),
    Api.posts.getAll(),
    Api.comments.getAll(),
    Api.comments.getLatestComments(),
    Api.posts.getHotPosts(),
    Api.categories.getCategoriesCount(),
  ]);

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

  const [
    categories,
    posts,
    comments,
    categoriesCount,
  ] = await Promise.all([
    Api.categories.getAll(),
    Api.posts.getPostsByCategoryId(id),
    Api.comments.getAll(),
    Api.categories.getCategoriesCount(),
  ]);

  res.render(`pages/main/category`, {
    posts,
    comments,
    categories,
    activeCategoryId: id,
    categoriesCount,
  });
});

module.exports = mainRouter;
