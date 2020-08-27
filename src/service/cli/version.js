'use strict';

const {
  AppCommands,
  LoggerNames,
} = require(`../../../config/constants`);
const {createLogger} = require(`../../utils/logger`);

const log = createLogger(LoggerNames.BACKEND);

module.exports = {
  name: AppCommands.VERSION,
  run() {
    log.info(process.version);
  },
};
