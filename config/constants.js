'use strict';

const path = require(`path`);

const ExitCodes = {
  SUCCESS: 0,
  ERROR: 1
};

const MY_FIRSTNAME = `Sergey`;
const MY_LASTNAME = `Topolov`;
const MY_EMAIL = `sj_89@mail.ru`;
const DATE_FORMAT = `YYYY-MM-DD HH:mm:ss`;
const BACKEND_DATE_FORMAT = `DD-MM-YYYY`;
const COMMON_DATE_FORMAT = `DD.MM.YYYY HH:MM`;
const DEFAULT_GENERATE_COUNT = 1;
const GENERATE_MAX_ITEMS_ALLOWED = 1000;
const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const HttpCodes = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
const PATH_TO_FILES = path.join(process.cwd(), `data`);
const PATH_TO_MOCKDATA = path.join(process.cwd(), `mocks`);

const MockFilesPaths = {
  USERS: `${PATH_TO_MOCKDATA}/users.json`,
  CATEGORIES: `${PATH_TO_MOCKDATA}/categories.json`,
  ARTICLES: `${PATH_TO_MOCKDATA}/articles.json`,
  COMMENTS: `${PATH_TO_MOCKDATA}/comments.json`,
};

const BACKEND_API_PREFIX = `/api`;
const ARTICLES_PAGE_LIMIT = 8;
const MAX_LATEST_COUNT = 4;
const UsersRoles = {
  ADMIN: `admin`,
  READER: `reader`
};
const ADMIN_ID = 1;

module.exports = {
  ExitCodes,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  HttpCodes,
  PATH_TO_FILES,
  PATH_TO_MOCKDATA,
  DEFAULT_GENERATE_COUNT,
  GENERATE_MAX_ITEMS_ALLOWED,
  MockFilesPaths,
  BACKEND_API_PREFIX,
  DATE_FORMAT,
  MY_FIRSTNAME,
  MY_LASTNAME,
  ARTICLES_PAGE_LIMIT,
  UsersRoles,
  ADMIN_ID,
  MY_EMAIL,
  BACKEND_DATE_FORMAT,
  MAX_LATEST_COUNT,
  COMMON_DATE_FORMAT,
};
