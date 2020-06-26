'use strict';

const {Router} = require(`express`);
const dayjs = require(`dayjs`);
const {HttpCodes, MY_NAME} = require(`../../../../../config/constants`);

const postsPageRouter = new Router();

const router = (api) => {
  postsPageRouter.get(`/post/:id`, (req, res) => {
    const {id} = req.params;

    const post = api.posts.findById(id);
    const categories = api.categories.getAll();
    const users = api.users.getAll();
    const currentUser = api.users.getUserByName(MY_NAME);
    const categoriesCount = api.categories.getCategoriesCount();
    const comments = api.comments.getCommentsByPostId(id);

    const data = {
      categories,
      currentUser,
      post,
      users,
      categoriesCount,
      comments,
    };

    res.status(HttpCodes.OK).json(data);
  });

  postsPageRouter.get(`/new`, (req, res) => {
    const categories = api.categories.getAll();
    const currentDate = dayjs().format(`D.MM.YYYY`);

    const data = {
      categories,
      currentDate,
    };

    res.status(HttpCodes.OK).json(data);
  });

  return postsPageRouter;
};

module.exports = router;
