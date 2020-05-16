'use strict';

const path = require(`path`);

const exitCodes = {
  SUCCESS: 0,
  ERROR: 1
};

const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const PATH_TO_FILES = path.join(process.cwd(), `data`);

module.exports = {
  exitCodes,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  PATH_TO_FILES,
};
