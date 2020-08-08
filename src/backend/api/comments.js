"use strict";

const dayjs = require(`dayjs`);
const {
  DATE_FORMAT,
  ADMIN_ID,
  HttpCodes,
} = require(`../../../config/constants`);
const {CustomError} = require(`../../utils/utils`);

const commentsApi = (entityName, database) => ({
  async getAll() {
    return await database[entityName].findAll();
  },

  async findById(id) {
    const comment = await database[entityName].findByPk(id);
    if (!comment) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_COMMENT_ID`, {id}));
    }
    return comment;
  },

  async delete(id) {
    const num = await database[entityName].destroy({where: {id}});
    if (!+num) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_COMMENT_ID`, {id}));
    }
    return id;
  },

  async add(articleId, data) {
    const articleInDB = await database.Article.findByPk(articleId);
    if (!articleInDB) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_ARTICLE_ID`, {id: articleId}));
    }
    const user = await database.User.findByPk(ADMIN_ID);
    if (!user) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_USER_ID`, {id: ADMIN_ID}));
    }
    return await database[entityName].create({
      ...data,
      articleId,
      userId: user.id,
      createdDate: dayjs().format(DATE_FORMAT),
    });
  },

  async getCommentsByArticleId(articleId) {
    const articleInDB = await database.Article.findByPk(articleId);
    if (!articleInDB) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_ARTICLE_ID`, {id: articleId}));
    }
    const comments = database[entityName].findAll({where: {articleId}});
    return comments;
  },

  async getMyComments() {
    const user = await database.User.findByPk(ADMIN_ID);
    if (!user) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_USER_ID`, {id: ADMIN_ID}));
    }
    return await database[entityName].findAll({where: {userId: user.id}});
  },

  async getLatestComments() {
    const MAX_LATEST_COUNT = 3;
    return await database[entityName].findAll({
      order: [[`createdDate`, `DESC`]],
      limit: MAX_LATEST_COUNT,
    });
  }
});

module.exports = commentsApi;
