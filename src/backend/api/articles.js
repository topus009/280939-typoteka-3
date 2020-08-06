"use strict";

const {Op, literal} = require(`sequelize`);
const dayjs = require(`dayjs`);
const {
  DATE_FORMAT,
  HttpCodes,
  ARTICLES_PAGE_LIMIT,
} = require(`../../../config/constants`);
const {
  CustomError,
  sqlzObjsToArr,
  sqlzExcludeFieldsFromObjs,
  sqlzParse,
  getHighlitedMatches,
} = require(`../../utils/utils`);

const articlesApi = (entityName, database) => ({
  async getAll() {
    const data = await database[entityName].findAll({
      include: [
        {
          model: database.Category,
          as: `categories`,
          required: false,
          attributes: [`id`],
          through: {attributes: []}
        },
      ]
    });
    return sqlzObjsToArr(data, `categories`, `id`);
  },

  async getTotalCount(categoryId) {
    if (!isNaN(categoryId)) {
      const category = await database.Category.findByPk(categoryId);
      return await category.countArticle();
    }
    return await database[entityName].count();
  },

  async getArticlesByPage(page) {
    let num = parseInt(page, 10);
    if (isNaN(num)) {
      throw new CustomError(HttpCodes.BAD_REQUEST, _f(`PAGE_SHOULD_BE_A_NUMBER`));
    } else if (num <= 0) {
      throw new CustomError(HttpCodes.BAD_REQUEST, _f(`PAGE_SHOULD_BE_GREATER_THAN_ZERO`));
    }
    const data = await database[entityName].findAll({
      include: [
        {
          model: database.Category,
          as: `categories`,
          required: false,
          attributes: [`id`],
          through: {attributes: []}
        },
      ],
      limit: ARTICLES_PAGE_LIMIT,
      offset: ARTICLES_PAGE_LIMIT * (num - 1),
    });
    return sqlzObjsToArr(data, `categories`, `id`);
  },

  async findById(id) {
    let article = await database[entityName].findByPk(id);
    if (!article) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_ARTICLE_ID`, {id}));
    }
    const categories = await article.getCategories({raw: true});
    article = article.toJSON();
    const data = {
      ...article,
      categories: categories.map((el) => el.id),
      createdDate: dayjs(article.createdDate).format(`DD.MM.YYYY`)
    };
    return data;
  },

  async delete(id) {
    const num = await database[entityName].destroy({where: {id}});
    if (!num) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_ARTICLE_ID`, {id}));
    }
    return id;
  },

  async add(data) {
    const createdDate = data.createdDate ?
      dayjs(data.createdDate).format(DATE_FORMAT) : dayjs().format(DATE_FORMAT);

    const article = await database[entityName].create({
      ...data,
      createdDate,
    });
    await article.setCategories(Array.isArray(data.categories) ? data.categories : [data.categories]);
    return article.id;
  },

  async edit(id, data) {
    const targetArticle = await database[entityName].findByPk(id);
    if (!targetArticle) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_ARTICLE_ID`, {id}));
    }
    const article = await targetArticle.update(data);
    let categories = Array.isArray(data.categories) ? data.categories : [data.categories];
    categories = categories.filter(Boolean);
    if (categories.length) {
      await article.setCategories(categories);
    }
    return {...article.toJSON(), categories};
  },

  async getArticlesByCategoryId(id, page = 1) {
    let num = parseInt(page, 10);
    if (isNaN(num)) {
      throw new CustomError(HttpCodes.BAD_REQUEST, _f(`PAGE_SHOULD_BE_A_NUMBER`));
    } else if (num <= 0) {
      throw new CustomError(HttpCodes.BAD_REQUEST, _f(`PAGE_SHOULD_BE_GREATER_THAN_ZERO`));
    }
    const category = await database.Category.findByPk(id);
    if (!category) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_CATEGORY_ID`, {id}));
    }
    const data = await category.getArticle({
      include: [
        {
          model: database.Category,
          as: `categories`,
          required: false,
          attributes: [`id`],
          through: {attributes: []},
        },
      ],
      limit: ARTICLES_PAGE_LIMIT,
      offset: ARTICLES_PAGE_LIMIT * (num - 1),
    });
    const preparedData = sqlzExcludeFieldsFromObjs(data, [`articles_categories`]);
    return sqlzObjsToArr(preparedData, `categories`, `id`);
  },

  async searchByTitle(query) {
    const data = await database[entityName].findAll({
      where: {
        title: {[Op.iLike]: `%${query}%`}
      },
      include: [
        {
          model: database.Category,
          as: `categories`,
          required: false,
          attributes: [`id`],
          through: {attributes: []}
        },
      ]
    });
    const articles = sqlzObjsToArr(data, `categories`, `id`);
    const results = [];
    articles.forEach((article) => {
      const formattedMatch = getHighlitedMatches(query, article.title);
      if (formattedMatch) {
        results.push({
          ...article,
          title: formattedMatch
        });
      }
    });
    return results;
  },

  async getHotArticles() {
    const MAX_HOT_COUNT = 4;
    const articles = await database[entityName].findAll({
      attributes: {
        include: [
          [literal(`(SELECT COUNT(*) FROM comments WHERE "comments"."articleId" = "Article"."id")`), `commentsCount`],
        ]
      },
      order: [[literal(`"commentsCount"`), `DESC`]],
      limit: MAX_HOT_COUNT,
    });
    return sqlzParse(articles).map((item) => ([item.id, +item.commentsCount]));
  },
});

module.exports = articlesApi;
