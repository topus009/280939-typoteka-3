"use strict";

const ApiUsers = require(`../users/users`);
const ApiComments = require(`../comments/comments`);
const axios = require(`../axios`);
const {getHighlitedMatches} = require(`../utils`);

module.exports = {
  getAll() {
    return axios.get(`/posts`).then((res) => res.data);
  },

  async getPostById(id) {
    const posts = await this.getAll();
    return posts.find((item) => item.id === id);
  },

  async getPostsByCategoryId(id) {
    const posts = await this.getAll();
    return posts.filter((post) => post.categories.includes(id));
  },

  async getMyPosts() {
    const [
      posts,
      currentUser
    ] = await Promise.all([
      this.getAll(),
      ApiUsers.getUserByName(`Topolov Sergey`)
    ]);
    const myPosts = [];

    posts.forEach((post) => {
      if (post.userId === currentUser.id) {
        myPosts.push(post.id);
      }
    });
    return myPosts;
  },

  async searchByTitle(query) {
    const posts = await this.getAll();
    const results = [];

    posts.forEach((post) => {
      const formattedMatch = getHighlitedMatches(query, post.title);
      if (formattedMatch) {
        results.push({
          ...post,
          title: formattedMatch
        });
      }
    });
    return results;
  },

  async getHotPosts() {
    const MAX_HOT_COUNT = 4;
    const [
      posts,
      comments
    ] = await Promise.all([
      this.getAll(),
      ApiComments.getAll()
    ]);

    const getCommentsCount = (id, commentsData) => {
      if (commentsData[id]) {
        return commentsData[id].length;
      }
      return 0;
    };
    const sortedPostsByCommentsCount =
      posts
        .sort((a, b) => (getCommentsCount(b.id, comments)) - getCommentsCount(a.id, comments))
        .slice(0, MAX_HOT_COUNT);
    const postsCount = sortedPostsByCommentsCount.map((post) => {
      return [post.id, comments[post.id].length];
    });
    return postsCount;
  },
};
