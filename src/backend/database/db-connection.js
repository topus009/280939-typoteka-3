"use strict";

const {Sequelize} = require(`sequelize`);
const {
  createLogger,
  LoggerNames,
} = require(`../../utils/logger`);
const {ExitCodes} = require(`../../../config/constants`);
const {exit} = require(`../../utils/utils`);
const UserModel = require(`./models/user`);
const ArticleModel = require(`./models/article`);
const CategoryModel = require(`./models/category`);
const CommentModel = require(`./models/comment`);

const log = createLogger(LoggerNames.DATABASE);

const sequelize = new Sequelize(
    process.env.PG_DATABASE,
    process.env.PG_USER,
    process.env.PG_PASSWORD,
    {
      host: process.env.PG_HOST,
      dialect: process.env.PG_DIALECT,
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
      logging: false,
    }
);

const models = {
  Article: ArticleModel.init(sequelize, Sequelize),
  Category: CategoryModel.init(sequelize, Sequelize),
  Comment: CommentModel.init(sequelize, Sequelize),
  User: UserModel.init(sequelize, Sequelize),
};

Object.values(models).forEach((model) => model.associate(models));

const initDatabase = async () => {
  await sequelize.sync({force: true});
  log.info(`DB structure has been created`);
};

const connectToDatabase = async () => {
  try {
    log.debug(`Connecting to Database started.`);
    await sequelize.authenticate();
    log.info(`Connection to Database has been established successfully.`);
  } catch (err) {
    log.error(`Unable to connect to the database: ${err}`);
    exit(ExitCodes.ERROR);
  }
};

module.exports = {
  connectToDatabase,
  sequelize,
  initDatabase,
};
