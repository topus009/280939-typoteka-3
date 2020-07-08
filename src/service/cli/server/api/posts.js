"use strict";

const {nanoid} = require(`nanoid`);
const dayjs = require(`dayjs`);
const {
  DATE_FORMAT,
  HttpCodes,
} = require(`../../../../config/constants`);
const {CustomError} = require(`../../../../utils/utils`);
const {getHighlitedMatches} = require(`./utils`);

const postsApi = (entityName, database) => ({
  delete(id) {
    const post = database[entityName].find((item) => item.id === id);
    if (!post) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_POST_ID`, {id}));
    }
    database[entityName] = database[entityName].filter((item) => item.id !== id);
    delete database.comments[id];
    return id;
  },

  add(data) {
    const id = nanoid();
    const createdDate = data.createdDate ? dayjs(data.createdDate).format(DATE_FORMAT) : dayjs().format(DATE_FORMAT);

    const categories = !Array.isArray(data.categories) ? [data.categories] : data.categories;
    database[entityName].push({
      id,
      ...data,
      createdDate,
      categories,
    });
    return id;
  },

  edit(id, data) {
    let post;

    const targetPost = database[entityName].find((item) => item.id === id);
    if (!targetPost) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_POST_ID`, {id}));
    }

    database[entityName] = database[entityName].map((item) => {
      if (item.id === id) {

        const categories = !Array.isArray(data.categories) ? [data.categories] : data.categories;

        post = {
          ...item,
          ...data,
          categories,
        };
        return post;
      } else {
        return item;
      }
    });
    return post;
  },

  getAll() {
    return database[entityName];
  },

  findById(id) {
    const posts = database[entityName];
    const post = posts.find((item) => item.id === id);
    if (!post) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_POST_ID`, {id}));
    }
    return {
      ...post,
      createdDate: dayjs(post.createdDate).format(`DD.MM.YYYY`)
    };
  },

  getPostsByCategoryId(id) {
    const posts = database[entityName];
    const categories = database.categories;
    const category = categories.find((item) => item.id === id);
    if (!category) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_CATEGORY_ID`, {id}));
    }
    return posts.filter((post) => post.categories.includes(id));
  },

  searchByTitle(query) {
    const posts = database[entityName];
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

    const posts = database[entityName];
    const comments = database.comments;

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
