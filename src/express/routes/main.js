'use strict';

const {Router} = require(`express`);
const {
  getSearchData,
  getHotAndLateatData,
  getCategoriesCount,
  getCategoryPostsData,
} = require(`../db/utils`);
const {
  posts,
  categories,
  comments,
  users,
} = require(`../db`);

const mainRouter = new Router();

const {mostPopularPosts, lastComments} = getHotAndLateatData({comments, posts});
const categoriesCount = getCategoriesCount(posts);

mainRouter.get(`/search`, (req, res) => {
  const query = req.query.query;
  let searchResults = [];
  if (query) {
    searchResults = getSearchData(query, posts);
    res.render(`pages/main/search`, {searchResults, query});
  } else {
    res.render(`pages/main/search`);
  }
});
mainRouter.get(`/`, (req, res) => res.render(`pages/main/main`, {
  posts,
  categories,
  comments,
  users,
  mostPopularPosts,
  lastComments,
  categoriesCount,
}));

mainRouter.get(`/category/:id`, (req, res) => {
  const {id} = req.params;
  res.render(`pages/main/category`, {
    posts: getCategoryPostsData(posts, id),
    comments,
    categories,
    activeCategoryId: id,
    categoriesCount,
  });
});

module.exports = mainRouter;
