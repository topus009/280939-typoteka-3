'use strict';

const {Router} = require(`express`);
const dayjs = require(`dayjs`);
const {HttpCodes, MY_NAME} = require(`../../../../../config/constants`);

const postsPageRouter = new Router();

const router = (Api) => {
  postsPageRouter.get(`/post/:id`, (req, res) => {
    const {id} = req.params;

    const post = Api.posts.findById(id);
    const categories = Api.categories.getAll();
    const users = Api.users.getAll();
    const currentUser = Api.users.getUserByName(MY_NAME);
    const categoriesCount = Api.categories.getCategoriesCount();
    const comments = Api.comments.getCommentsByPostId(id);

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
    const categories = Api.categories.getAll();
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
