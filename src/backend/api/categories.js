"use strict";

const {HttpCodes} = require(`../../../config/constants`);
const {CustomError} = require(`../../utils/utils`);

const categoriesApi = (entityName, database) => ({
  async getAll() {
    try {
      return await database[entityName].findAll();
    } catch (error) {
      return error;
    }
  },

  async findById(id) {
    try {
      const category = await database[entityName].findByPk(+id);
      if (!category) {
        throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_CATEGORY_ID`, {id}));
      }
      return category;
    } catch (error) {
      return error;
    }
  },

  async delete(id) {
    try {
      const category = await database[entityName].findByPk(+id);
      if (!category) {
        throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_CATEGORY_ID`, {id}));
      }
      const articles = await category.getArticle();
      let blockedArticles = [];
      for (const article of articles) {
        const categoriesCount = await article.countCategories();
        if (categoriesCount === 1) {
          blockedArticles.push(article.id);
        }
      }
      if (blockedArticles.length) {
        throw new CustomError(HttpCodes.BAD_REQUEST, _f(`DELETING_CATEGORY_HAS_ARTICLES`, {ids: blockedArticles}));
      }
      await category.destroy();
      return id;
    } catch (error) {
      return error;
    }
  },

  async add(data) {
    try {
      const category = await database[entityName].create(data);
      return category;
    } catch (error) {
      if (error.name === `SequelizeUniqueConstraintError`) {
        return new CustomError(HttpCodes.BAD_REQUEST, _f(`DUPLICATE_CATEGORY_LABEL`));
      }
      return error;
    }
  },

  async edit(id, data) {
    try {
      const targetCategory = await database[entityName].findByPk(+id);
      if (!targetCategory) {
        throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_CATEGORY_ID`, {id}));
      }
      return await targetCategory.update(data);
    } catch (error) {
      if (error.name === `SequelizeUniqueConstraintError`) {
        return new CustomError(HttpCodes.BAD_REQUEST, _f(`DUPLICATE_CATEGORY_LABEL`));
      }
      return error;
    }
  },

  async getCategoriesCount() {
    try {
      const categories = await database[entityName].findAll();
      const categoriesCount = {};
      for (const category of categories) {
        const count = await category.countArticle();
        if (count) {
          categoriesCount[category.id] = count;
        }
      }
      return categoriesCount;
    } catch (error) {
      return error;
    }
  }
});

module.exports = categoriesApi;
