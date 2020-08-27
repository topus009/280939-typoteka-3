'use strict';

const path = require(`path`);

const {env} = process;

// codes
const ExitCodes = {
  SUCCESS: 0,
  ERROR: 1,
};
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
// numbers
const DEFAULT_GENERATE_COUNT = 1;
const GENERATE_MAX_ITEMS_ALLOWED = 1000;
const USER_ARGV_INDEX = 2;
const ARTICLES_PAGE_LIMIT = 8;
const COMMENTS_MAX_LATEST_COUNT = 4;
const ARTICLES_MAX_HOT_COUNT = 4;
const ADMIN_ID = 1;
const PASSWORD_MIN_LETTERS = 6;
const COMMENT_MIN_LETTERS = 20;
const CATEGORY_LABEL_MIN_LETTERS = 5;
const CATEGORY_LABEL_MAX_LETTERS = 30;
const MIN_CATEGORY_SELECTED = 1;
const ARTICLE_TITLE_MIN_LETTERS = 30;
const ARTICLE_TITLE_MAX_LETTERS = 250;
const ARTICLE_ANNOUNCE_MIN_LETTERS = 30;
const ARTICLE_ANNOUNCE_MAX_LETTERS = 250;
const ARTICLE_FULLTEXT_MAX_LETTERS = 1000;
const SESSION_EXPIRATION = 5 * 24 * 60 * 60 * 1000; // 5 days
const SESSION_EXPIRATION_INTERVAL = 24 * 60 * 60 * 1000; // 1 day
const SESSION_COOKIE_MAX_AGE = 5 * 24 * 60 * 60 * 1000; // 5 days
const GENERATE_ANNOUNCE_MAX_COUNT = 5;
const GENERATE_CATEGORIES_MAX_COUNT = 3;
const GENERATE_ARTICLE_IMG_INDEX = 5;
const GENERATE_USERS_MAX_COUNT = 10;
const GENERATE_CIMMENTS_COUNT_MULTIPLIER = 3;
const GENERATE_MAX_MONTHS_FROM_NOW = 3;
// paths
const EXPRESS_PATH_TO_PUBLIC = path.resolve(process.cwd(), `./src/frontend/public`);
const EXPRESS_PATH_TO_TEMPLATES = path.join(process.cwd(), `./src/frontend/templates`);
const BACKEND_ARTICLES_PATH = `img/articles`;
const BACKEND_AVATARS_PATH = `img/avatars`;
const DEFAULT_AVATAR = `img/icons/smile.svg`;
const DEFAULT_ARTICLE = `img/articles/sea@1x.jpg`;
const PATH_TO_PUBLIC_PREFIX = `./src/frontend/public/`;
const LOG_PATH = path.resolve(process.cwd(), `logs/`);
const PATH_TO_FILES = path.join(process.cwd(), `data`);
const PATH_TO_TMP = path.join(process.cwd(), `tmp`);
const PATH_TO_MOCKDATA = path.join(process.cwd(), `mocks`);
const PATH_TO_PUBLIC = path.join(process.cwd(), PATH_TO_PUBLIC_PREFIX);
const GENERATE_ADMIN_AVATAR = `https://git.io/JUUaf`;
const GENERATE_ADMIN_AVATAR_SMALL = `https://git.io/JUUaL`;
const MockFilesPaths = {
  USERS: `${PATH_TO_MOCKDATA}/users.json`,
  CATEGORIES: `${PATH_TO_MOCKDATA}/categories.json`,
  ARTICLES: `${PATH_TO_MOCKDATA}/articles.json`,
  COMMENTS: `${PATH_TO_MOCKDATA}/comments.json`,
};
// lists
const AppCommands = {
  VERSION: `--version`,
  HELP: `--help`,
  GENERATE: `--generate`,
  SERVER: `--server`,
};
const UsersRoles = {
  ADMIN: `admin`,
  READER: `reader`,
};
const DatabaseTableNames = {
  USERS: `User`,
  CATEGORIES: `Category`,
  ARTICLES: `Article`,
  COMMENTS: `Comment`,
};
const ValidImgExtensions = [
  `.png`,
  `.jpg`,
  `.jpeg`,
];
const LoggerNames = {
  FRONTEND: `FRONTEND`,
  FRONTEND_API: `FRONTEND_API`,
  BACKEND: `BACKEND`,
  BACKEND_API: `BACKEND_API`,
  DATABASE: `DATABASE`,
  COMMON: `COMMON`,
};
const LogFileTypes = {
  LOG: `logs`,
  TEST: `test-logs`,
};
// formats
const DATE_FORMAT = `YYYY-MM-DD HH:mm:ss`;
const BACKEND_DATE_FORMAT = `DD-MM-YYYY`;
const COMMON_DATE_FORMAT = `DD.MM.YYYY HH:MM`;
const LOGGER_MESSAGE_FORMAT = `[31m[{ENV}][39m - [36m{msg}[39m`;
const LOGGER_TIME_FORMAT = `yyyy.mm.dd HH:MM:ss.l`;
// regexp
const VALID_NAME_REGEXP = /^(?=.{1,40}$)[a-zA-Zа-яА-Я]+(?:[-'][a-zA-Z]+)*$/;
// other
const MY_FIRSTNAME = `Sergey`;
const MY_LASTNAME = `Topolov`;
const MY_EMAIL = `sj_89@mail.ru`;
const DEFAULT_COMMAND = AppCommands.HELP;
const BACKEND_API_PREFIX = `/api`;
const BASE_URL = `${env.BACKEND_API_HOST}:${env.BACKEND_API_PORT}${BACKEND_API_PREFIX}`;
const ARTICLE_IMG_PREFIX = `img`;
const AVATAR_IMG_PREFIX = `avatar`;
const SESSION_COOKIE_NAME = `sid`;
const SESSION_UID = `uid`;
const DAYJS_DEFAULT_LOCALE = `ru`;
const DEFAULT_LOCALIZATION_LOCALE = `en`;
const DEFAULT_FILE_ENCODING = `utf8`;
const DEFAULT_LOG_LEVEL = `info`;
const databaseOptions = [
  env.PG_DATABASE,
  env.PG_USER,
  env.PG_PASSWORD,
  {
    host: env.PG_HOST,
    dialect: env.PG_DIALECT,
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
    logging: false,
  },
];

module.exports = {
  ADMIN_ID,
  AppCommands,
  ARTICLE_ANNOUNCE_MAX_LETTERS,
  ARTICLE_ANNOUNCE_MIN_LETTERS,
  ARTICLE_FULLTEXT_MAX_LETTERS,
  ARTICLE_IMG_PREFIX,
  ARTICLE_TITLE_MAX_LETTERS,
  ARTICLE_TITLE_MIN_LETTERS,
  ARTICLES_PAGE_LIMIT,
  AVATAR_IMG_PREFIX,
  BACKEND_API_PREFIX,
  BACKEND_ARTICLES_PATH,
  BACKEND_AVATARS_PATH,
  BACKEND_DATE_FORMAT,
  BASE_URL,
  CATEGORY_LABEL_MAX_LETTERS,
  CATEGORY_LABEL_MIN_LETTERS,
  COMMENT_MIN_LETTERS,
  COMMON_DATE_FORMAT,
  databaseOptions,
  DatabaseTableNames,
  DATE_FORMAT,
  DAYJS_DEFAULT_LOCALE,
  DEFAULT_ARTICLE,
  DEFAULT_AVATAR,
  DEFAULT_COMMAND,
  DEFAULT_FILE_ENCODING,
  DEFAULT_GENERATE_COUNT,
  DEFAULT_LOCALIZATION_LOCALE,
  DEFAULT_LOG_LEVEL,
  ExitCodes,
  EXPRESS_PATH_TO_PUBLIC,
  EXPRESS_PATH_TO_TEMPLATES,
  GENERATE_ADMIN_AVATAR_SMALL,
  GENERATE_ADMIN_AVATAR,
  GENERATE_ANNOUNCE_MAX_COUNT,
  GENERATE_ARTICLE_IMG_INDEX,
  GENERATE_CATEGORIES_MAX_COUNT,
  GENERATE_CIMMENTS_COUNT_MULTIPLIER,
  GENERATE_MAX_ITEMS_ALLOWED,
  GENERATE_MAX_MONTHS_FROM_NOW,
  GENERATE_USERS_MAX_COUNT,
  HttpCodes,
  LOG_PATH,
  LogFileTypes,
  LOGGER_MESSAGE_FORMAT,
  LOGGER_TIME_FORMAT,
  LoggerNames,
  ARTICLES_MAX_HOT_COUNT,
  COMMENTS_MAX_LATEST_COUNT,
  MIN_CATEGORY_SELECTED,
  MockFilesPaths,
  MY_EMAIL,
  MY_FIRSTNAME,
  MY_LASTNAME,
  PASSWORD_MIN_LETTERS,
  PATH_TO_FILES,
  PATH_TO_MOCKDATA,
  PATH_TO_PUBLIC_PREFIX,
  PATH_TO_PUBLIC,
  PATH_TO_TMP,
  SESSION_COOKIE_MAX_AGE,
  SESSION_COOKIE_NAME,
  SESSION_EXPIRATION_INTERVAL,
  SESSION_EXPIRATION,
  SESSION_UID,
  USER_ARGV_INDEX,
  UsersRoles,
  VALID_NAME_REGEXP,
  ValidImgExtensions,
};
