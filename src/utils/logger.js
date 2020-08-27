'use strict';

const path = require(`path`);
const pino = require(`pino`);
const {
  LOGGER_MESSAGE_FORMAT,
  LOGGER_TIME_FORMAT,
  DEFAULT_LOG_LEVEL,
  LOG_PATH,
  LogFileTypes,
} = require(`../../config/constants`);

const getLogFilePath = (filePaths) => {
  const isTesting = process.env.TESTING;
  const logPathType = isTesting ? filePaths.TEST : filePaths.LOG;
  const logPath = path.join(LOG_PATH, logPathType);
  return pino.destination(logPath);
};

const shouldWriteToFile = () => {
  const {NODE_ENV, TESTING} = process.env;
  return Boolean(NODE_ENV !== `development` || TESTING);
};

const logger = pino({
  base: null,
  level: process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL,
  prettyPrint: {
    translateTime: LOGGER_TIME_FORMAT,
    colorize: true,
    messageFormat: LOGGER_MESSAGE_FORMAT,
    ignore: `ENV`,
  },
}, shouldWriteToFile() && getLogFilePath(LogFileTypes));

const createLogger = (name, options = {}) => logger.child({
  ...options,
  name,
  ENV: process.env.NODE_ENV,
});

module.exports = {
  createLogger,
};
