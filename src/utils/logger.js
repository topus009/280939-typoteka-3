'use strict';

const path = require(`path`);
const pino = require(`pino`);

const LogFilePaths = {
  log: `logs`,
  test: `test-logs`,
};

const getLogFilePath = (filePaths) => {
  const isTesting = process.env.TESTING;
  const logPathType = isTesting ? filePaths.test : filePaths.log;
  const logPath = path.resolve(process.cwd(), `logs/${logPathType}`);

  return pino.destination(logPath);
};

const LoggerNames = {
  FRONTEND: `FRONTEND`,
  FRONTEND_API: `FRONTEND_API`,
  BACKEND: `BACKEND`,
  BACKEND_API: `BACKEND_API`,
  DATABASE: `DATABASE`,
  COMMON: `COMMON`,
};

const shouldWriteToFile = () => {
  const {NODE_ENV, TESTING} = process.env;
  if (NODE_ENV !== `development`) {
    return true;
  } else if (TESTING) {
    return true;
  }
  return false;
};

const logger = pino({
  base: null,
  level: process.env.LOG_LEVEL || `info`,
  prettyPrint: {
    translateTime: `yyyy.mm.dd HH:MM:ss.l`,
    colorize: true,
    messageFormat: `[31m[{ENV}][39m - [36m{msg}[39m`,
    ignore: `ENV`
  },
}, shouldWriteToFile() && getLogFilePath(LogFilePaths));

const createLogger = (name, options = {}) => logger.child({
  ...options,
  name,
  ENV: process.env.NODE_ENV,
});

module.exports = {
  createLogger,
  LoggerNames
};
