"use strict";

const fs = require(`fs`);
const path = require(`path`);
const dayjs = require(`dayjs`);
const {ExitCodes, DATE_FORMAT, HttpCodes} = require(`../../config/constants`);
const {createLogger, LoggerNames} = require(`./logger`);

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

const readDirAsync = (folderPath) =>
  fs.promises.readdir(folderPath, (err, files) => {
    if (err) {
      log.error(err);
    }
    return files;
  });

const readFileAsync = async (pathToFile, asText) => {
  const data = await fs.promises.readFile(pathToFile, `utf8`);
  if (asText) {
    return data;
  }
  return data.toString().split(`\n`).filter(Boolean);
};

const writeToFileAsync = async (pathToFile, name, content) => {
  const filePath = path.join(pathToFile, name);
  try {
    await fs.promises.writeFile(filePath, content, `utf8`);
    log.info(`File ${name} was created!`);
    log.info(`Destination: ${path.resolve(filePath)}`);
  } catch (err) {
    log.error(err);
  }
};

const exit = (type) => {
  process.exit(ExitCodes[type] || ExitCodes.SUCCESS);
};

const getRandomDate = () => {
  const MAX_MONTHS_FROM_NOW = 3;
  const currentDate = dayjs();
  const pastDate = dayjs(currentDate).subtract(MAX_MONTHS_FROM_NOW, `month`);
  const start = pastDate.valueOf();
  const end = currentDate;

  return dayjs(getRangomInteger(start, end, true)).format(DATE_FORMAT);
};

const getRandomString = (arr) => {
  return arr[getRangomInteger(0, arr.length - 1)];
};

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
    super(message || `Unknown error`);
    this.statusCode = statusCode || HttpCodes.INTERNAL_SERVER_ERROR;
    this.text = message;
  }
}

const isFileExistsAsync = async (filePath) => !!(await fs.promises.stat(filePath).catch(() => false));

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
};
