'use strict';

const {Router} = require(`express`);
const dayjs = require(`dayjs`);
const {HttpCodes, MY_NAME} = require(`../../../../config/constants`);
const {CustomError} = require(`../../../utils/utils`);

const articlesPageRouter = new Router();

const router = (api) => {
  articlesPageRouter.get(`/article/:id`, async (req, res, next) => {
    const {id} = req.params;
    try {
      const article = await api.articles.findById(id);
      if (article instanceof CustomError) {
        next(article);
      }
      const [
        categories,
        users,
        currentUser,
        categoriesCount,
        comments,
      ] = await Promise.all([
        api.categories.getAll(),
        api.users.getAll(),
        api.users.getUserByName(MY_NAME),
        api.categories.getCategoriesCount(),
        api.comments.getCommentsByArticleId(id),
      ]);
      const data = {
        categories,
        currentUser,
        article,
        users,
        categoriesCount,
        comments,
      };
      return res.status(HttpCodes.OK).json(data);
    } catch (error) {
      return error;
    }
  });

  articlesPageRouter.get(`/article/edit/:id`, async (req, res, next) => {
    const {id} = req.params;
    try {
      const article = await api.articles.findById(id);
      if (article instanceof CustomError) {
        next(article);
      }
      const categories = await api.categories.getAll();
      const data = {
        categories,
        article
      };

      return res.status(HttpCodes.OK).json(data);
    } catch (error) {
      return error;
    }
  });

  articlesPageRouter.get(`/add`, async (req, res) => {
    try {
      const categories = await api.categories.getAll();

      const data = {
        categories,
        isNew: true,
        article: {
          'created_date': dayjs().format(`DD.MM.YYYY`)
        }
      };

      return res.status(HttpCodes.OK).json(data);
    } catch (error) {
      return error;
    }
  });

  return articlesPageRouter;
};

module.exports = router;
