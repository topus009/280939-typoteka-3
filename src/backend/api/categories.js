"use strict";

const {Op} = require(`sequelize`);
const {HttpCodes} = require(`../../../config/constants`);
const {CustomError} = require(`../../utils/utils`);
const fm = require(`../../utils/localization`);

const categoriesApi = (entityName, database) => ({
  async getAll() {
    const data = await database[entityName].findAll();
    return data;
  },

  async findById(id) {
    const category = await database[entityName].findByPk(id);
    if (!category) {
      throw new CustomError(HttpCodes.NOT_FOUND, fm(`NO_CATEGORY_ID`, {id}));
    }
    return category;
  },

  async findByLabel(label) {
    const data = await database[entityName].findOne({
      where: {
        label: {
          [Op.like]: `%${label}%`,
        },
      },
    });
    return data;
  },

  async delete(id) {
    const category = await database[entityName].findByPk(id);
    if (!category) {
      throw new CustomError(HttpCodes.NOT_FOUND, fm(`NO_CATEGORY_ID`, {id}));
    }
    const articles = await category.getArticle();
    const blockedArticles = [];
    const countTasksIds = [];
    const countTasks = [];
    for (const article of articles) {
      countTasksIds.push(article.id);
      countTasks.push(article.countCategories());
    }
    const countResults = await Promise.all(countTasks);
    countTasksIds.forEach((countId, index) => {
      const count = countResults[index];
      if (count === 1) {
        blockedArticles.push(countId);
      }
    });
    if (blockedArticles.length) {
      throw new CustomError(
        HttpCodes.BAD_REQUEST,
        fm(`DELETING_CATEGORY_HAS_ARTICLES`, {ids: blockedArticles}),
      );
    }
    await category.destroy();
    return id;
  },

  async add(data) {
    const createdCategory = await database[entityName].create(data);
    return createdCategory;
  },

  async edit(id, data) {
    const targetCategory = await database[entityName].findByPk(id);
    if (!targetCategory) {
      throw new CustomError(HttpCodes.NOT_FOUND, fm(`NO_CATEGORY_ID`, {id}));
    }
    const updatedCategory = await targetCategory.update(data);
    return updatedCategory;
  },

  async countAll() {
    const categories = await database[entityName].findAll();
    const categoriesCount = {};
    const countTasksIds = [];
    const countTasks = [];
    for (const category of categories) {
      countTasksIds.push(category.id);
      countTasks.push(category.countArticle());
    }
    const countResults = await Promise.all(countTasks);
    countTasksIds.forEach((id, index) => {
      const count = countResults[index];
      if (count) {
        categoriesCount[id] = count;
      }
    });
    return categoriesCount;
  },
});

module.exports = categoriesApi;
