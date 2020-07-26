"use strict";

const dayjs = require(`dayjs`);
const {
  DATE_FORMAT,
  MY_NAME,
  HttpCodes,
} = require(`../../../config/constants`);
const {CustomError} = require(`../../utils/utils`);

const commentsApi = (entityName, database, api) => ({
  delete(id) {
    const prevCommentsLength = database[entityName].length;
    database[entityName] = database[entityName].filter((item) => item.id !== +id);
    if (prevCommentsLength === database[entityName].length) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_COMMENT_ID`, {id}));
    }
    return id;
  },

  add(articleId, data) {
    const id = database[entityName].length + 1;
    const {id: userId} = api.users(`users`, database, api).getUserByName(MY_NAME);
    const article = database.articles.find((item) => item.id === +articleId);
    if (!article) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_ARTICLE_ID`, {id}));
    }
    database[entityName].push({
      id,
      ...data,
      articleId: +articleId,
      userId,
      createdDate: dayjs().format(DATE_FORMAT),
    });
    return id;
  },

  findById(id) {
    const comment = database[entityName].find((item) => item.id === +id);
    if (!comment) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_COMMENT_ID`, {id}));
    }
    return comment || null;
  },

  getAll() {
    return database[entityName];
  },

  getCommentsByArticleId(articleId) {
    const articleInDB = database.articles.find((item) => item.id === +articleId);
    if (!articleInDB) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_ARTICLE_ID`, {id: articleId}));
    }
    const comments = database[entityName].filter((comment) => comment.articleId === +articleId);
    return comments || [];
  },

  getMyComments() {
    const comments = database[entityName];
    const currentUser = api.users(`users`, database, api).getUserByName(MY_NAME);
    return comments.filter((comment) => comment.userId === currentUser.id);
  },

  getLatestComments() {
    const MAX_LATEST_COUNT = 3;
    const comments = database[entityName];

    const formatDate = (value) => dayjs(value).valueOf();

    const sortedCommentsByLatesDate =
      comments
        .sort((a, b) => (formatDate(b.createdDate) - formatDate(a.createdDate)))
        .slice(0, MAX_LATEST_COUNT);
    return sortedCommentsByLatesDate;
  }
});

module.exports = commentsApi;
