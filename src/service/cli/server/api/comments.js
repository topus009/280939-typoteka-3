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
  delete(articleId, id) {
    const article = database[entityName][articleId];
    const articleInDB = database.articles.find((item) => item.id === articleId);
    if (!article) {
      if (!articleInDB) {
        throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_ARTICLE_ID`, {id: articleId}));
      }
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_COMMENTS_WITH_ARTICLE_ID`, {id: articleId}));
    }
    const comment = article.find((item) => item.id === id);
    if (!comment) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_COMMENT_ID`, {id}));
    }
    database[entityName][articleId] = database[entityName][articleId].filter((item) => item.id !== id);
    if (!database[entityName][articleId].length) {
      delete database[entityName][articleId];
    }
    return id;
  },

  add(articleId, data) {
    const id = nanoid();
    const {id: userId} = api.users(`users`, database, api).getUserByName(MY_NAME);
    const article = database.articles.find((item) => item.id === articleId);
    if (!article) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_ARTICLE_ID`, {id}));
    }
    if (!database[entityName][articleId]) {
      database[entityName][articleId] = [];
    }
    database[entityName][articleId].push({
      id,
      ...data,
      userId,
      createdDate: dayjs().format(DATE_FORMAT),
    });
    return id;
  },

  findById(articleId, id) {
    const comments = database[entityName][articleId];
    if (!comments) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_ARTICLE_ID`, {id: articleId}));
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

  getCommentsByArticleId(articleId) {
    const articleInDB = database.articles.find((item) => item.id === articleId);
    if (!articleInDB) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_ARTICLE_ID`, {id: articleId}));
    }
    const comments = database[entityName][articleId];
    return comments || [];
  },

  getMyComments() {
    const comments = database[entityName];
    const currentUser = api.users(`users`, database, api).getUserByName(MY_NAME);

    const myComments = {};

    Object.keys(comments).forEach((articleId) => {
      const articleComments = comments[articleId];
      for (const comment of articleComments) {
        if (comment.userId === currentUser.id) {
          if (!myComments[articleId]) {
            myComments[articleId] = [];
          }
          myComments[articleId].push(comment);
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
        .reduce((commentsAcc, articleId) => {
          const preparedComments = comments[articleId].map((item) => ({...item, articleId}));
          return [...commentsAcc, ...preparedComments];
        }, [])
        .sort((a, b) => (formatDate(b.createdDate) - formatDate(a.createdDate)))
        .slice(0, MAX_LATEST_COUNT);
    return sortedCommentsByLatesDate;
  }
});

module.exports = commentsApi;
