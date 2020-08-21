'use strict';

const {
  createLogger,
  LoggerNames,
} = require(`../../utils/logger`);

const log = createLogger(LoggerNames.BACKEND);

module.exports = {
  name: `--version`,
  run() {
    log.info(process.version);
  }
};
