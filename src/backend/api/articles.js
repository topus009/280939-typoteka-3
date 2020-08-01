"use strict";

const {Op, literal} = require(`sequelize`);
const dayjs = require(`dayjs`);
const {
  DATE_FORMAT,
  HttpCodes,
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
    try {
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
    } catch (error) {
      return error;
    }
  },

  async findById(id) {
    try {
      let article = await database[entityName].findByPk(+id);
      if (!article) {
        throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_ARTICLE_ID`, {id}));
      }
      const categories = await article.getCategories({raw: true});
      article = article.toJSON();
      const data = {
        ...article,
        "categories": categories.map((el) => el.id),
        'created_date': dayjs(article.created_date).format(`DD.MM.YYYY`)
      };
      return data;
    } catch (error) {
      return error;
    }
  },

  async delete(id) {
    try {
      const num = await database[entityName].destroy({where: {id: +id}});
      if (!num) {
        throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_ARTICLE_ID`, {id}));
      }
      return id;
    } catch (error) {
      return error;
    }
  },

  async add(data) {
    try {
      const createdDate = data.created_date ?
        dayjs(data.created_date).format(DATE_FORMAT) : dayjs().format(DATE_FORMAT);

      const article = await database[entityName].create({
        ...data,
        'created_date': createdDate,
      });
      await article.setCategories(Array.isArray(data.categories) ? data.categories : [data.categories]);
      return article.id;
    } catch (error) {
      return error;
    }
  },

  async edit(id, data) {
    try {
      const targetArticle = await database[entityName].findByPk(+id);
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
    } catch (error) {
      return error;
    }
  },

  async getArticlesByCategoryId(id) {
    try {
      const category = await database.Category.findByPk(+id);
      if (!category) {
        throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_CATEGORY_ID`, {id}));
      }
      console.log(category.getArticles);
      const data = await category.getArticle({
        include: [
          {
            model: database.Category,
            as: `categories`,
            required: false,
            attributes: [`id`],
            through: {attributes: []},
          },
        ]
      });
      const prepedData = sqlzExcludeFieldsFromObjs(data, [`articles_categories`]);
      return sqlzObjsToArr(prepedData, `categories`, `id`);
    } catch (error) {
      return error;
    }
  },

  async searchByTitle(query) {
    try {
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
    } catch (error) {
      return error;
    }
  },

  async getHotArticles() {
    const MAX_HOT_COUNT = 4;
    try {
      const articles = await database[entityName].findAll({
        attributes: {
          include: [
            [literal(`(SELECT COUNT(*) FROM comments WHERE comments.article_id = "Article"."id")`), `commentsCount`],
          ]
        },
        order: [[literal(`"commentsCount"`), `DESC`]],
        limit: MAX_HOT_COUNT,
      });
      return sqlzParse(articles).map((item) => ([item.id, +item.commentsCount]));
    } catch (error) {
      return error;
    }
  },
});

module.exports = articlesApi;
