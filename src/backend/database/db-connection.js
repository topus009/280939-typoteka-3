'use strict';

const {Sequelize} = require(`sequelize`);
const {createLogger, LoggerNames} = require(`../../utils/logger`);
const {ExitCodes} = require(`../../../config/constants`);
const {exit} = require(`../../utils/utils`);

const log = createLogger(LoggerNames.DATABASE);

const connectToDatabase = async () => {
  const sequelize = new Sequelize(
      process.env.PG_DATABASE,
      process.env.PG_USER,
      process.env.PG_PASSWORD,
      {
        host: process.env.PG_HOST,
        dialect: process.env.PG_DIALECT,
      }
  );

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
  connectToDatabase
};
