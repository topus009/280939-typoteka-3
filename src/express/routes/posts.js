'use strict';

const {Router} = require(`express`);
const dayjs = require(`dayjs`);
const {getCategoriesCount} = require(`../db/utils`);
const {
  categories,
  posts,
  comments,
  users,
  currentUser,
} = require(`../db`);

const postsRouter = new Router();

const getCurrentPost = (postId) => posts.find((post) => post.id === postId);

const post = getCurrentPost(posts[4].id);
const categoriesCount = getCategoriesCount(posts);

postsRouter.get(`/`, (req, res) => res.render(`pages/posts/post`, {
  currentUser,
  comments: comments[post.id],
  categories,
  post,
  users,
  categoriesCount,
}));

postsRouter.get(`/new`, (req, res) => res.render(`pages/posts/new-post`, {
  categories,
  currentDate: dayjs().format(`D.MM.YYYY`)
}));

module.exports = postsRouter;
