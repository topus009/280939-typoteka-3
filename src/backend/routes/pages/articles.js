'use strict';

const {Router} = require(`express`);
const {
  HttpCodes,
  COMMON_DATE_FORMAT,
  BACKEND_ARTICLES_PATH,
} = require(`../../../../config/constants`);
const {catchAsync} = require(`../../../utils/utils`);
const dayjs = require(`../../../utils/dayjs`);

const articlesPageRouter = new Router();

const router = (api) => {
  articlesPageRouter.get(`/article/:id`, catchAsync(async (req, res) => {
    const {id} = req.params;
    const article = await api.articles.findById(id);
    const [
      categories,
      users,
      categoriesCount,
      comments,
    ] = await Promise.all([
      api.categories.getAll(),
      api.users.getAll(),
      api.categories.countAll(),
      api.comments.getAllByArticleId(id),
    ]);
    const data = {
      categories,
      article,
      users,
      categoriesCount,
      comments,
    };
    res.status(HttpCodes.OK).json(data);
    return;
  }));

  articlesPageRouter.get(`/article/edit/:id`, catchAsync(async (req, res) => {
    const {id} = req.params;
    const article = await api.articles.findById(id);
    const categories = await api.categories.getAll();
    const data = {
      categories,
      article: {
        ...article,
        img: article.img ? article.img.replace(`${BACKEND_ARTICLES_PATH}/`, ``) : ``,
      },
    };
    res.status(HttpCodes.OK).json(data);
    return;
  }));

  articlesPageRouter.get(`/add`, catchAsync(async (req, res) => {
    const categories = await api.categories.getAll();
    const data = {
      categories,
      isNew: true,
      article: {
        createdDate: dayjs().format(COMMON_DATE_FORMAT),
      },
    };
    res.status(HttpCodes.OK).json(data);
    return;
  }));
  return articlesPageRouter;
};

module.exports = router;
