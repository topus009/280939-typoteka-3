"use strict";

const {Op} = require(`sequelize`);
const {HttpCodes} = require(`../../../config/constants`);
const {CustomError} = require(`../../utils/utils`);

const categoriesApi = (entityName, database) => ({
  async getAll() {
    return await database[entityName].findAll();
  },

  async findById(id) {
    const category = await database[entityName].findByPk(id);
    if (!category) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_CATEGORY_ID`, {id}));
    }
    return category;
  },

  async findByLabel(label) {
    return await database[entityName].findOne({
      where: {
        label: {
          [Op.like]: `%${label}%`
        }
      }
    });
  },

  async delete(id) {
    const category = await database[entityName].findByPk(id);
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
  },

  async add(data) {
    return await database[entityName].create(data);
  },

  async edit(id, data) {
    const targetCategory = await database[entityName].findByPk(id);
    if (!targetCategory) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_CATEGORY_ID`, {id}));
    }
    return await targetCategory.update(data);
  },

  async getCategoriesCount() {
    const categories = await database[entityName].findAll();
    const categoriesCount = {};
    for (const category of categories) {
      const count = await category.countArticle();
      if (count) {
        categoriesCount[category.id] = count;
      }
    }
    return categoriesCount;
  }
});

module.exports = categoriesApi;
