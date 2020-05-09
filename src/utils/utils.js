'use strict';

const fs = require(`fs`);
const chalk = require(`chalk`);
const path = require(`path`);
const moment = require(`moment`);
const {exitCodes} = require(`../config/constants`);

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
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

// eslint-disable-next-line consistent-return
const readFileAsync = async (pathToFile) => {
  try {
    const data = await fs.promises.readFile(pathToFile, `utf8`);

    return data
      .toString()
      .split(`\n`)
      .filter(Boolean);
  } catch (err) {
    console.log(err);
  }
};

const writeToFileAsync = async (pathToFile, name, content) => {
  const filePath = path.join(pathToFile, name);
  try {
    await fs.promises.writeFile(filePath, content, `utf8`);
    console.log(`Файл ${chalk.red(name)} был создан!`);
    console.log(`Расположение: ${chalk.cyan(path.resolve(filePath))}`);
  } catch (err) {
    console.log(err);
  }
};

const exit = (type) => {
  process.exit(exitCodes[type] || exitCodes.success);
};

const getRandomDate = () => {
  const MAX_MONTHS_FROM_NOW = 3;
  const currentDate = moment.now();
  const pastDate = moment(currentDate).subtract(MAX_MONTHS_FROM_NOW, `months`);
  const start = pastDate.valueOf();
  const end = currentDate;

  return moment(getRangomInteger(start, end, true)).format(`YYYY-MM-DD HH:mm:ss`);
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

module.exports = {
  getRangomInteger,
  shuffle,
  readFileAsync,
  writeToFileAsync,
  exit,
  getRandomDate,
  getRandomString,
  getRandomStrings,
};
