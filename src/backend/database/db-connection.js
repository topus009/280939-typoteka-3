"use strict";

const {Sequelize} = require(`sequelize`);
const {
  ExitCodes,
  databaseOptions,
  LoggerNames,
} = require(`../../../config/constants`);
const {createLogger} = require(`../../utils/logger`);
const {exit} = require(`../../utils/utils`);
const UserModel = require(`./models/user`);
const ArticleModel = require(`./models/article`);
const CategoryModel = require(`./models/category`);
const CommentModel = require(`./models/comment`);

const log = createLogger(LoggerNames.DATABASE);

const database = new Sequelize(...databaseOptions);

const models = {
  Article: ArticleModel.init(database, Sequelize),
  Category: CategoryModel.init(database, Sequelize),
  Comment: CommentModel.init(database, Sequelize),
  User: UserModel.init(database, Sequelize),
};

Object.values(models).forEach((model) => model.associate(models));

const initDatabase = async () => {
  await database.sync({force: true});
  log.info(_f(`DB_STRUCTURE_CREATED`));
};

const connectToDatabase = async () => {
  try {
    log.debug(_f(`DB_CONNECTION_STARTED`));
    await database.authenticate();
    log.info(_f(`DB_CONNECTION_SUCCESS`));
  } catch (err) {
    log.error(_f(`DB_CONNECTION_ERROR`, {err}));
    exit(ExitCodes.ERROR);
  }
};

module.exports = {
  connectToDatabase,
  database,
  initDatabase,
};
