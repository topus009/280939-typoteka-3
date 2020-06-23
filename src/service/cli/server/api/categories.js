"use strict";

const {nanoid} = require(`nanoid`);
const {MY_NAME} = require(`../../../../config/constants`);

const categoriesApi = (entityName, DB, Api) => ({
  delete(id) {
    DB[entityName] = DB[entityName].filter((category) => category.id !== id);
    return id;
  },

  add(data) {
    const id = nanoid();
    DB[entityName].push({
      id,
      ...data,
    });
    return id;
  },

  findById(id) {
    const category = DB[entityName].find((item) => item.id === id);
    return category ? category : null;
  },

  getAll() {
    return DB[entityName];
  },

  getMyCategories() {
    const posts = DB.posts;
    const currentUser = Api.users(`users`, DB, Api).getUserByName(MY_NAME);
    const myCategories = new Set();

    posts.forEach((post) => {
      if (post.userId === currentUser.id) {
        post.categories.forEach((categoryId) => myCategories.add(categoryId));
      }
    });
    return [...myCategories];
  },

  getCategoriesCount() {
    const posts = DB.posts;
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
