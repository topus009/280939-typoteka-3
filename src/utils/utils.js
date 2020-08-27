"use strict";

const fs = require(`fs`);
const path = require(`path`);
const {
  ExitCodes,
  DATE_FORMAT,
  HttpCodes,
  ARTICLES_PAGE_LIMIT,
  BACKEND_DATE_FORMAT,
  DEFAULT_FILE_ENCODING,
  GENERATE_MAX_MONTHS_FROM_NOW,
  LoggerNames,
} = require(`../../config/constants`);
const dayjs = require(`./dayjs`);
const {createLogger} = require(`./logger`);
const fm = require(`./localization`);

const log = createLogger(LoggerNames.COMMON);

const getRangomInteger = (min, max, noNeedRoundOff) => {
  if (!noNeedRoundOff) {
    min = Math.ceil(min);
    max = Math.floor(max);
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [
      someArray[randomPosition],
      someArray[i],
    ];
  }
  return someArray;
};

const readDirAsync = (folderPath) => {
  return fs.promises.readdir(folderPath, (err, files) => {
    return err ? log.error(err) : files;
  });
};

const readFileAsync = async (pathToFile, asText) => {
  const data = await fs.promises.readFile(pathToFile, DEFAULT_FILE_ENCODING);
  if (asText) {
    return data;
  }
  return data.toString().split(`\n`).filter(Boolean);
};

const writeToFileAsync = async (pathToFile, name, content) => {
  const filePath = path.join(pathToFile, name);
  try {
    await fs.promises.writeFile(filePath, content, DEFAULT_FILE_ENCODING);
    log.info(fm(`FILE_CREATED`, {name}));
    log.info(fm(`FILE_DESTINATION`, {dest: path.resolve(filePath)}));
  } catch (err) {
    log.error(err);
  }
};

const exit = (code) => {
  process.exit(code || ExitCodes.SUCCESS);
};

const getRandomDate = () => {
  const currentDate = dayjs();
  const pastDate = dayjs(currentDate)
    .subtract(GENERATE_MAX_MONTHS_FROM_NOW, `month`);
  const start = pastDate.valueOf();
  const end = currentDate;
  return dayjs(getRangomInteger(start, end, true)).format(DATE_FORMAT);
};

const getRandomString = (arr) => arr[getRangomInteger(0, arr.length - 1)];

const getRandomStrings = (arr, maxArrLength) => {
  const shuffledArr = shuffle(arr);
  let shuffledArrLength = shuffledArr.length;

  if (!maxArrLength) {
    maxArrLength = arr.length;
    if (shuffledArrLength > maxArrLength) {
      shuffledArrLength = maxArrLength;
    }
  }

  const newArrLength = getRangomInteger(1, shuffledArrLength - 1);
  const res = shuffledArr.slice(0, newArrLength);
  return res;
};

const parseCommandParam = (param) => parseInt(param[0], 10);

class CustomError extends Error {
  constructor(statusCode, message) {
    super(message || fm(`UNKNOWN_ERROR`));
    this.statusCode = statusCode || HttpCodes.INTERNAL_SERVER_ERROR;
    this.text = message;
  }
}

const isFileExistsAsync = async (filePath) => {
  const exists = await fs.promises.stat(filePath).catch(() => false);
  return !!exists;
};

const sqlzParse = (data) => JSON.parse(JSON.stringify(data));

const sqlzObjsToArr = (data, key, objKey) => {
  const parsedData = sqlzParse(data);
  const formattedData = parsedData.map((item) => {
    const formattedField = {};
    if (item[key]) {
      formattedField[key] = item[key].map((el) => el[objKey]);
    }
    return {
      ...item,
      ...formattedField,
    };
  });
  return formattedData;
};

const getHighlitedMatches = (queryString, string) => {
  let newString = ``;
  const rgxp = new RegExp(`(\\S*)?(${queryString})(\\S*)?`, `ig`);
  if (queryString.trim().length > 0) {
    newString = string.replace(rgxp, (match, $1, $2, $3) => {
      return `${$1 || ``}<b>${$2}</b>${$3 || ``}`;
    });
  }
  return newString.length !== string.length ? newString : ``;
};

const getPaginationData = ({articlesTotalCount, page}) => {
  if (page) {
    return {
      activePage: +page,
      pagesCount: Math.ceil(articlesTotalCount / ARTICLES_PAGE_LIMIT),
      articlesTotalCount,
    };
  }
  return {};
};

const catchAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const capitalizeFirstLetter = (str) => str[0].toUpperCase() + str.slice(1);

const useCommonErrorsHandler = (logCb) => (error, req, res, next, cb) => {
  const {text, statusCode} = error;
  const {method, url} = req;
  const formattedText = Array.isArray(text) ? JSON.stringify(text) : text;

  logCb.error(`${method} ${url} - statusCode - ${statusCode}, text - ${formattedText}`);
  return cb(res, next, error);
};

const normalizeDate = (date, formatStr) => {
  const dateObj = date ? dayjs(date, BACKEND_DATE_FORMAT) : dayjs();
  if (formatStr) {
    return dateObj.format(formatStr);
  }
  return dateObj;
};

module.exports = {
  getRangomInteger,
  shuffle,
  readDirAsync,
  readFileAsync,
  writeToFileAsync,
  exit,
  getRandomDate,
  getRandomString,
  getRandomStrings,
  parseCommandParam,
  CustomError,
  isFileExistsAsync,
  getHighlitedMatches,
  sqlzObjsToArr,
  sqlzParse,
  getPaginationData,
  catchAsync,
  capitalizeFirstLetter,
  useCommonErrorsHandler,
  normalizeDate,
};
