"use strict";

const {
  Op,
  literal,
} = require(`sequelize`);
const {
  ARTICLES_MAX_HOT_COUNT,
  DATE_FORMAT,
  HttpCodes,
  ARTICLES_PAGE_LIMIT,
  COMMON_DATE_FORMAT,
} = require(`../../../config/constants`);
const dayjs = require(`../../utils/dayjs`);
const {
  CustomError,
  sqlzObjsToArr,
  sqlzParse,
  getHighlitedMatches,
  normalizeDate,
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
          through: {attributes: []},
        },
      ],
      order: [[`createdDate`, `DESC`]],
    });
    const preparedData = sqlzObjsToArr(data, `categories`, `id`);
    return preparedData.map((item) => ({
      ...item,
      createdDate: dayjs(item.createdDate).format(COMMON_DATE_FORMAT),
    }));
  },

  async getTotalCount(categoryId) {
    let count;
    if (!isNaN(categoryId)) {
      const category = await database.Category.findByPk(categoryId);
      count = await category.countArticle();
    } else {
      count = await database[entityName].count();
    }
    return count;
  },

  async getAllByPage(page) {
    const num = parseInt(page, 10);
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
          through: {attributes: []},
        },
      ],
      limit: ARTICLES_PAGE_LIMIT,
      offset: ARTICLES_PAGE_LIMIT * (num - 1),
      order: [[`createdDate`, `DESC`]],
    });
    const preparedData = sqlzObjsToArr(data, `categories`, `id`);
    return preparedData.map((item) => ({
      ...item,
      createdDate: dayjs(item.createdDate).format(COMMON_DATE_FORMAT),
    }));
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
      createdDate: dayjs(article.createdDate).format(COMMON_DATE_FORMAT),
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
    const createdDate = normalizeDate(data.createdDate, DATE_FORMAT);
    const article = await database[entityName].create({
      ...data,
      createdDate,
    });
    await article.setCategories(
      Array.isArray(data.categories) ? data.categories : [data.categories],
    );
    return article.id;
  },

  async edit(id, data) {
    const targetArticle = await database[entityName].findByPk(id);
    if (!targetArticle) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_ARTICLE_ID`, {id}));
    }
    if (data.createdDate) {
      data.createdDate = normalizeDate(data.createdDate, DATE_FORMAT);
    }
    const article = await targetArticle.update(data);
    let categories = Array.isArray(data.categories) ? data.categories : [data.categories];
    categories = categories.filter(Boolean);
    if (categories.length) {
      await article.setCategories(categories);
    }
    return {
      ...article.toJSON(),
      categories,
    };
  },

  async getAllByCategoryId(id, page = 1) {
    const num = parseInt(page, 10);
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
      joinTableAttributes: [],
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
      order: [[`createdDate`, `DESC`]],
    });
    const preparedData = sqlzObjsToArr(data, `categories`, `id`);
    return preparedData.map((item) => ({
      ...item,
      createdDate: dayjs(item.createdDate).format(COMMON_DATE_FORMAT),
    }));
  },

  async searchByTitle(query) {
    const data = await database[entityName].findAll({
      where: {
        title: {[Op.iLike]: `%${query}%`},
      },
      include: [
        {
          model: database.Category,
          as: `categories`,
          required: false,
          attributes: [`id`],
          through: {attributes: []},
        },
      ],
      order: [[`createdDate`, `DESC`]],
    });
    const preparedData = sqlzObjsToArr(data, `categories`, `id`);
    const articles = preparedData.map((item) => ({
      ...item,
      createdDate: dayjs(item.createdDate).format(COMMON_DATE_FORMAT),
    }));
    const results = [];
    articles.forEach((article) => {
      const formattedMatch = getHighlitedMatches(query, article.title);
      if (formattedMatch) {
        results.push({
          ...article,
          title: formattedMatch,
        });
      }
    });
    return results;
  },

  async getHot() {
    const articles = await database[entityName].findAll({
      attributes: {
        include: [
          [
            literal(`(SELECT COUNT(*) FROM comments WHERE "comments"."articleId" = "Article"."id")`),
            `commentsCount`,
          ],
        ],
      },
      order: [[literal(`"commentsCount"`), `DESC`]],
      limit: ARTICLES_MAX_HOT_COUNT,
    });
    return sqlzParse(articles).map((item) => [item.id, +item.commentsCount, item.title]);
  },
});

module.exports = articlesApi;
