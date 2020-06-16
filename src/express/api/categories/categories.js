"use strict";

const ApiUsers = require(`../users/users`);
const ApiPosts = require(`../posts/posts`);
const axios = require(`../axios`);

module.exports = {
  getAll() {
    return axios.get(`/categories`).then((res) => res.data);
  },

  async getMyCategories() {
    const posts = await ApiPosts.getAll();
    const currentUser = await ApiUsers.getUserByName(`Topolov Sergey`);
    const myCategories = new Set();

    posts.forEach((post) => {
      if (post.userId === currentUser.id) {
        post.categories.forEach((categoryId) => myCategories.add(categoryId));
      }
    });
    return [...myCategories];
  },

  async getCategoriesCount() {
    const posts = await ApiPosts.getAll();
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
};
