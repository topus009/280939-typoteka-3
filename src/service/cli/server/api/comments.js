"use strict";

const {nanoid} = require(`nanoid`);
const dayjs = require(`dayjs`);
const {
  DATE_FORMAT,
  MY_NAME,
  HttpCodes,
} = require(`../../../../config/constants`);
const {CustomError} = require(`../../../../utils/utils`);

const commentsApi = (entityName, database, api) => ({
  delete(postId, id) {
    const post = database[entityName][postId];
    const postInDB = database.posts.find((item) => item.id === postId);
    if (!post) {
      if (!postInDB) {
        throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_POST_ID`, {id: postId}));
      }
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_COMMENTS_WITH_POST_ID`, {id: postId}));
    }
    const comment = post.find((item) => item.id === id);
    if (!comment) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_COMMENT_ID`, {id}));
    }
    database[entityName][postId] = database[entityName][postId].filter((item) => item.id !== id);
    if (!database[entityName][postId].length) {
      delete database[entityName][postId];
    }
    return id;
  },

  add(postId, data) {
    const id = nanoid();
    const {id: userId} = api.users(`users`, database, api).getUserByName(MY_NAME);
    const post = database.posts.find((item) => item.id === postId);
    if (!post) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_POST_ID`, {id}));
    }
    if (!database[entityName][postId]) {
      database[entityName][postId] = [];
    }
    database[entityName][postId].push({
      id,
      userId,
      createdDate: dayjs().format(DATE_FORMAT),
      ...data,
    });
    return id;
  },

  findById(postId, id) {
    const comments = database[entityName][postId];
    if (!comments) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_POST_ID`, {id: postId}));
    }
    const comment = comments.find((item) => item.id === id);
    if (!comment) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_COMMENT_ID`, {id}));
    }
    return comment || null;
  },

  getAll() {
    return database[entityName];
  },

  getCommentsByPostId(postId) {
    const comments = database[entityName][postId];
    if (!comments) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_POST_ID`, {id: postId}));
    }
    return comments || [];
  },

  getMyComments() {
    const comments = database[entityName];
    const currentUser = api.users(`users`, database, api).getUserByName(MY_NAME);

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
    const comments = database[entityName];

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
