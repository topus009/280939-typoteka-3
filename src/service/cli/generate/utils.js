'use strict';

const path = require(`path`);
const {createLogger, LoggerNames} = require(`../../../utils/logger`);
const {
  PATH_TO_FILES,
  DEFAULT_GENERATE_COUNT,
  GENERATE_MAX_ITEMS_ALLOWED,
} = require(`../../../../config/constants`);
const {
  readDirAsync,
  readFileAsync,
  parseCommandParam,
  exit,
} = require(`../../../utils/utils`);

const log = createLogger(LoggerNames.COMMON);

const getUserCount = (input) => {
  const parsedCount = parseCommandParam(input);

  if (isNaN(parsedCount)) {
    log.error(`You did not specify parameters or they are not valid. 1 record will be created`);
    return DEFAULT_GENERATE_COUNT;
  } else if (parsedCount > GENERATE_MAX_ITEMS_ALLOWED) {
    log.error(`It is possible to create no more than ${GENERATE_MAX_ITEMS_ALLOWED} records`);
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
          log.error(error);
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
