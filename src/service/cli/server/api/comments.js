"use strict";

const {nanoid} = require(`nanoid`);
const dayjs = require(`dayjs`);
const {
  DATE_FORMAT,
  MY_NAME,
  HttpCodes,
} = require(`../../../../config/constants`);
const {Err} = require(`../../../../utils/utils`);

const commentsApi = (entityName, dataBase, api) => ({
  delete(postId, id) {
    const post = dataBase[entityName][postId];
    const postInDB = dataBase.posts.find((item) => item.id === postId);
    if (!post) {
      if (!postInDB) {
        throw new Err(HttpCodes.NOT_FOUND, _f(`NO_POST_ID`, {id: postId}));
      }
      throw new Err(HttpCodes.NOT_FOUND, _f(`NO_COMMENTS_WITH_POST_ID`, {id: postId}));
    }
    const comment = post.find((item) => item.id === id);
    if (!comment) {
      throw new Err(HttpCodes.NOT_FOUND, _f(`NO_COMMENT_ID`, {id}));
    }
    dataBase[entityName][postId] = dataBase[entityName][postId].filter((item) => item.id !== id);
    if (!dataBase[entityName][postId].length) {
      delete dataBase[entityName][postId];
    }
    return id;
  },

  add(postId, data) {
    const id = nanoid();
    const {id: userId} = api.users(`users`, dataBase, api).getUserByName(MY_NAME);
    const post = dataBase.posts.find((item) => item.id === postId);
    if (!post) {
      throw new Err(HttpCodes.NOT_FOUND, _f(`NO_POST_ID`, {id}));
    }
    if (!dataBase[entityName][postId]) {
      dataBase[entityName][postId] = [];
    }
    dataBase[entityName][postId].push({
      id,
      userId,
      createdDate: dayjs().format(DATE_FORMAT),
      ...data,
    });
    return id;
  },

  findById(postId, id) {
    const comments = dataBase[entityName][postId];
    if (!comments) {
      throw new Err(HttpCodes.NOT_FOUND, _f(`NO_POST_ID`, {id: postId}));
    }
    const comment = comments.find((item) => item.id === id);
    if (!comment) {
      throw new Err(HttpCodes.NOT_FOUND, _f(`NO_COMMENT_ID`, {id}));
    }
    return comment || null;
  },

  getAll() {
    return dataBase[entityName];
  },

  getCommentsByPostId(postId) {
    const comments = dataBase[entityName][postId];
    if (!comments) {
      throw new Err(HttpCodes.NOT_FOUND, _f(`NO_POST_ID`, {id: postId}));
    }
    return comments || [];
  },

  getMyComments() {
    const comments = dataBase[entityName];
    const currentUser = api.users(`users`, dataBase, api).getUserByName(MY_NAME);

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
    const comments = dataBase[entityName];

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
