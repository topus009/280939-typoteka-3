'use strict';

const path = require(`path`);

const exitCodes = {
  SUCCESS: 0,
  ERROR: 1
};

const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const HTTP_CODES = {
  HTTP_SUCCESS_CODE: 200,
  HTTP_NOT_FOUND_CODE: 404,
};
const PATH_TO_FILES = path.join(process.cwd(), `data`);

module.exports = {
  exitCodes,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  HTTP_CODES,
  PATH_TO_FILES,
};
