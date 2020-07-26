"use strict";

const {HttpCodes} = require(`../../../config/constants`);
const {CustomError} = require(`../../utils/utils`);

const categoriesApi = (entityName, database) => ({
  delete(id) {
    const category = database[entityName].find((item) => item.id === +id);
    if (!category) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_CATEGORY_ID`, {id}));
    }
    database[entityName] = database[entityName].filter((item) => item.id !== +id);
    return id;
  },

  add(data) {
    const id = database[entityName].length + 1;
    database[entityName].push({
      id,
      ...data,
    });
    return id;
  },

  edit(id, data) {
    database[entityName] = database[entityName].map((item) => {
      if (item.id === +id) {
        return {
          ...item,
          ...data
        };
      } else {
        return item;
      }
    });
    return id;
  },

  findById(id) {
    const category = database[entityName].find((item) => item.id === +id);
    if (!category) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_CATEGORY_ID`, {id}));
    }
    return category;
  },

  getAll() {
    return database[entityName];
  },

  getCategoriesCount() {
    const articles = database.articles;
    const categoriesCount = {};

    articles.forEach((article) => {
      article.categories.forEach((id) => {
        if (!categoriesCount[id]) {
          categoriesCount[id] = [];
          categoriesCount[id].push(null);
        } else {
          categoriesCount[id].push(null);
        }
      });
    });
    Object.keys(categoriesCount).forEach((id) => {
      categoriesCount[id] = categoriesCount[id].length;
    });
    return categoriesCount;
  }
});

module.exports = categoriesApi;
