"use strict";

const {nanoid} = require(`nanoid`);
const dayjs = require(`dayjs`);
const {
  DATE_FORMAT,
  MY_NAME
} = require(`../../../../config/constants`);

const commentsApi = (entityName, DB, Api) => ({
  delete(postId, id) {
    DB[entityName][postId] = DB[entityName][postId].filter((comment) => comment.id !== id);
    if (!DB[entityName][postId].length) {
      delete DB[entityName][postId];
    }
    return id;
  },

  add(postId, data) {
    const id = nanoid();
    const {id: userId} = Api.users(`users`, DB, Api).getUserByName(MY_NAME);
    if (!DB[entityName][postId]) {
      DB[entityName][postId] = [];
    }
    DB[entityName][postId].push({
      id,
      userId,
      createdDate: dayjs().format(DATE_FORMAT),
      ...data,
    });
    return id;
  },

  findById(postId, id) {
    const comments = DB[entityName][postId];
    const comment = comments.find((item) => item.id === id);
    return comment || null;
  },

  getAll() {
    return DB[entityName];
  },

  getCommentsByPostId(postId) {
    const comments = DB[entityName];
    return comments[postId] || [];
  },

  getMyComments() {
    const comments = DB[entityName];
    const currentUser = Api.users(`users`, DB, Api).getUserByName(MY_NAME);

    const myComments = {};

    Object.keys(comments).forEach((postId) => {
      const postComments = comments[postId];
      for (const comment of postComments) {
        if (comment.userId === currentUser.id) {
          if (!myComments[postId]) {
            myComments[postId] = [];
          }
          myComments[postId].push(comment);
        }
      }
    });
    return myComments;
  },

  getLatestComments() {
    const MAX_LATEST_COUNT = 3;
    const comments = DB[entityName];

    const formatDate = (value) => dayjs(value).valueOf();

    const sortedCommentsByLatesDate =
      Object.keys(comments)
        .reduce((commentsAcc, postId) => {
          const preparedComments = comments[postId].map((item) => ({...item, postId}));
          return [...commentsAcc, ...preparedComments];
        }, [])
        .sort((a, b) => (formatDate(b.createdDate) - formatDate(a.createdDate)))
        .slice(0, MAX_LATEST_COUNT);
    return sortedCommentsByLatesDate;
  }
});

module.exports = commentsApi;
