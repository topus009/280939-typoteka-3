'use strict';
const logger = require(`../../utils/logger`);

module.exports = {
  name: `--version`,
  run() {
    logger.log(process.version);
  }
};
