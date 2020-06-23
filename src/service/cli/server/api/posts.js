"use strict";

const {nanoid} = require(`nanoid`);
const dayjs = require(`dayjs`);
const {
  DATE_FORMAT,
  MY_NAME
} = require(`../../../../config/constants`);
const {getHighlitedMatches} = require(`./utils`);

const postsApi = (entityName, DB, Api) => ({
  delete(id) {
    DB[entityName] = DB[entityName].filter((post) => post.id !== id);
    delete DB.comments[id];
    return id;
  },

  add(data) {
    const id = nanoid();
    const {id: userId} = Api.users(`users`, DB, Api).getUserByName(MY_NAME);
    DB[entityName].push({
      id,
      userId,
      createdDate: dayjs().format(DATE_FORMAT),
      ...data,
    });
    return id;
  },

  edit(id, data) {
    let post;

    DB[entityName] = DB[entityName].map((item) => {
      if (item.id === id) {
        post = {
          ...item,
          ...data
        };
        return post;
      } else {
        return item;
      }
    });
    return post;
  },

  getAll() {
    return DB[entityName];
  },

  findById(id) {
    const posts = DB[entityName];
    return posts.find((item) => item.id === id);
  },

  getPostsByCategoryId(id) {
    const posts = DB[entityName];
    return posts.filter((post) => post.categories.includes(id));
  },

  getMyPosts() {
    const posts = DB[entityName];
    const currentUser = Api.users(`users`, DB, Api).getUserByName(MY_NAME);

    const myPosts = [];

    posts.forEach((post) => {
      if (post.userId === currentUser.id) {
        myPosts.push(post.id);
      }
    });
    return myPosts;
  },

  searchByTitle(query) {
    const posts = DB[entityName];
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

  getHotPosts() {
    const MAX_HOT_COUNT = 4;

    const posts = DB[entityName];
    const comments = DB.comments;

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
});

module.exports = postsApi;
