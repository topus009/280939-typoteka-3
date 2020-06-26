"use strict";

const {nanoid} = require(`nanoid`);
const {
  MY_NAME,
  HttpCodes
} = require(`../../../../config/constants`);
const {Err} = require(`../../../../utils/utils`);

const categoriesApi = (entityName, dataBase, api) => ({
  delete(id) {
    const category = dataBase[entityName].find((item) => item.id === id);
    if (!category) {
      throw new Err(HttpCodes.NOT_FOUND, _f(`NO_CATEGORY_ID`, {id}));
    }
    dataBase[entityName] = dataBase[entityName].filter((item) => item.id !== id);
    return id;
  },

  add(data) {
    const id = nanoid();
    dataBase[entityName].push({
      id,
      ...data,
    });
    return id;
  },

  findById(id) {
    const category = dataBase[entityName].find((item) => item.id === id);
    if (!category) {
      throw new Err(HttpCodes.NOT_FOUND, _f(`NO_CATEGORY_ID`, {id}));
    }
    return category;
  },

  getAll() {
    return dataBase[entityName];
  },

  getMyCategories() {
    const posts = dataBase.posts;
    const currentUser = api.users(`users`, dataBase, api).getUserByName(MY_NAME);
    const myCategories = new Set();

    posts.forEach((post) => {
      if (post.userId === currentUser.id) {
        post.categories.forEach((categoryId) => myCategories.add(categoryId));
      }
    });
    return [...myCategories];
  },

  getCategoriesCount() {
    const posts = dataBase.posts;
    const categoriesCount = {};

    posts.forEach((post) => {
      post.categories.forEach((id) => {
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
