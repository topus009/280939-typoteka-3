'use strict';

const logger = require(`../../../../utils/logger`);
const path = require(`path`);
const {
  readDirAsync,
  readFileAsync,
  parseCommandParam,
  exit,
} = require(`../../../../utils/utils`);
const {PATH_TO_FILES, DEFAULT_GENERATE_COUNT, GENERATE_MAX_ITEMS_ALLOWED} = require(`../../../../config/constants`);

const getUserCount = (input) => {
  const parsedCount = parseCommandParam(input);

  if (isNaN(parsedCount)) {
    logger.error(`Вы не указали параметры или они не валидны. Будет создана 1 запись.`);

    return DEFAULT_GENERATE_COUNT;
  } else if (parsedCount > GENERATE_MAX_ITEMS_ALLOWED) {
    logger.error(`Возможно создать не больше ${GENERATE_MAX_ITEMS_ALLOWED} записей`);
    exit(`ERROR`);
  }

  return parsedCount;
};

const getSamples = async () => {
  const samples = {};

  const files = await readDirAsync(PATH_TO_FILES);

  for (const name in files) {
    if (files.hasOwnProperty(name)) {
      const [fileName, fileType] = files[name].split(`.`);
      try {
        samples[fileName] = await readFileAsync(path.join(PATH_TO_FILES, `${fileName}.${fileType}`));
      } catch (error) {
        if (error) {
          logger.error(error);
        }
      }
    }
  }

  return samples;
};

module.exports = {
  getUserCount,
  getSamples,
};
