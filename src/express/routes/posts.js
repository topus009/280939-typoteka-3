'use strict';

const {Router} = require(`express`);
const Api = require(`../api/api`);

const postsRouter = new Router();

postsRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const categories = await Api.categories.getAll();
  const users = await Api.users.getAll();
  const currentUser = await Api.users.getUserByName(`Topolov Sergey`);
  const post = await Api.posts.getPostById(id);
  const comments = await Api.comments.getCommentsByPostId(post.id);
  const categoriesCount = await Api.categories.getCategoriesCount();

  res.render(`pages/posts/post`, {
    currentUser,
    comments,
    categories,
    post,
    users,
    categoriesCount,
  });
});

postsRouter.get(`/new`, async (req, res) => {
  const categories = await Api.categories.getAll();
  const currentDate = await Api.common.getCurrentDate();

  res.render(`pages/posts/new-post`, {
    categories,
    currentDate,
  });
});

module.exports = postsRouter;
