"use strict";

const {Op} = require(`sequelize`);
const dayjs = require(`dayjs`);
const {
  DATE_FORMAT,
  MY_NAME,
  HttpCodes,
} = require(`../../../config/constants`);
const {CustomError} = require(`../../utils/utils`);

const commentsApi = (entityName, database) => ({
  async getAll() {
    try {
      return await database[entityName].findAll();
    } catch (error) {
      return error;
    }
  },

  async findById(id) {
    try {
      const comment = await database[entityName].findByPk(+id);
      if (!comment) {
        throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_COMMENT_ID`, {id}));
      }
      return comment;
    } catch (error) {
      return error;
    }
  },

  async delete(id) {
    try {
      const num = await database[entityName].destroy({where: {id: +id}});
      if (!+num) {
        throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_COMMENT_ID`, {id}));
      }
      return id;
    } catch (error) {
      return error;
    }
  },

  async add(articleId, data) {
    const articleInDB = await database.Article.findByPk(+articleId);
    if (!articleInDB) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_ARTICLE_ID`, {id: articleId}));
    }
    const {id: userId} = await database.User.findOne({where: {name: {[Op.like]: MY_NAME}}});
    return await database[entityName].create({
      ...data,
      'article_id': +articleId,
      'user_id': userId,
      'created_date': dayjs().format(DATE_FORMAT),
    });
  },

  async getCommentsByArticleId(articleId) {
    try {
      const articleInDB = await database.Article.findByPk(+articleId);
      if (!articleInDB) {
        throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_ARTICLE_ID`, {id: articleId}));
      }
      const comments = database[entityName].findAll({where: {'article_id': +articleId}});
      return comments;
    } catch (error) {
      return error;
    }
  },

  async getMyComments() {
    const currentUser = await database.User.findOne({where: {name: {[Op.like]: MY_NAME}}});
    return await database[entityName].findAll({where: {'user_id': currentUser.id}});
  },

  async getLatestComments() {
    const MAX_LATEST_COUNT = 3;
    return await database[entityName].findAll({
      order: [[`created_date`, `DESC`]],
      limit: MAX_LATEST_COUNT,
    });
  }
});

module.exports = commentsApi;
