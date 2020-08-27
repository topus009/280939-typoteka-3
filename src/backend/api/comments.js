"use strict";

const {
  DATE_FORMAT,
  ADMIN_ID,
  HttpCodes,
  COMMENTS_MAX_LATEST_COUNT,
  COMMON_DATE_FORMAT,
} = require(`../../../config/constants`);
const dayjs = require(`../../utils/dayjs`);
const {
  CustomError,
  sqlzParse,
} = require(`../../utils/utils`);

const commentsApi = (entityName, database) => ({
  async getAll() {
    const data = await database[entityName].findAll({
      order: [[`createdDate`, `ASC`]],
    });
    return sqlzParse(data).map((item) => ({
      ...item,
      createdDate: dayjs(item.createdDate).format(COMMON_DATE_FORMAT),
    }));
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

  async add(articleId, {userId, ...data}) {
    const articleInDB = await database.Article.findByPk(articleId);
    if (!articleInDB) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_ARTICLE_ID`, {id: articleId}));
    }
    const user = await database.User.findByPk(userId);
    if (!user) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_USER_ID`, {id: userId}));
    }
    const createdComment = await database[entityName].create({
      ...data,
      articleId,
      userId: user.id,
      createdDate: dayjs().format(DATE_FORMAT),
    });
    return createdComment;
  },

  async getAllByArticleId(articleId) {
    const articleInDB = await database.Article.findByPk(articleId);
    if (!articleInDB) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_ARTICLE_ID`, {id: articleId}));
    }
    const data = await database[entityName].findAll({
      where: {articleId},
      order: [[`createdDate`, `ASC`]],
    });
    return sqlzParse(data).map((item) => ({
      ...item,
      createdDate: dayjs(item.createdDate).format(COMMON_DATE_FORMAT),
    }));
  },

  async getMy() {
    const user = await database.User.findByPk(ADMIN_ID);
    if (!user) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_USER_ID`, {id: ADMIN_ID}));
    }
    const data = await database[entityName].findAll({
      where: {userId: user.id},
      order: [[`createdDate`, `DESC`]],
    });
    return sqlzParse(data).map((item) => ({
      ...item,
      createdDate: dayjs(item.createdDate).format(COMMON_DATE_FORMAT),
    }));
  },

  async getLatest() {
    const latestComments = await database[entityName].findAll({
      order: [[`createdDate`, `DESC`]],
      limit: COMMENTS_MAX_LATEST_COUNT,
    });
    return latestComments;
  },
});

module.exports = commentsApi;
