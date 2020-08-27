'use strict';

const path = require(`path`);
const {
  PATH_TO_FILES,
  DEFAULT_GENERATE_COUNT,
  GENERATE_MAX_ITEMS_ALLOWED,
  ExitCodes,
  LoggerNames,
} = require(`../../../../config/constants`);
const {
  readDirAsync,
  readFileAsync,
  parseCommandParam,
  exit,
} = require(`../../../utils/utils`);
const fm = require(`../../../utils/localization`);
const {createLogger} = require(`../../../utils/logger`);

const log = createLogger(LoggerNames.COMMON);

const getUserCount = (input) => {
  const parsedCount = parseCommandParam(input);

  if (isNaN(parsedCount)) {
    log.error(fm(`GENERATE_ARTICLES_NO_COUNT`));
    return DEFAULT_GENERATE_COUNT;
  } else if (parsedCount > GENERATE_MAX_ITEMS_ALLOWED) {
    log.error(fm(`GENERATE_ARTICLES_MAX_LIMIT`, {limit: GENERATE_MAX_ITEMS_ALLOWED}));
    exit(ExitCodes.ERROR);
  }
  return parsedCount;
};

const readSamples = async (samples, files, name) => {
  const [fileName, fileType] = files[name].split(`.`);
  try {
    samples[fileName] = await readFileAsync(
      path.join(PATH_TO_FILES, `${fileName}.${fileType}`),
    );
  } catch (error) {
    if (error) {
      log.error(error);
    }
  }
};

const getSamples = async () => {
  const samples = {};
  const files = await readDirAsync(PATH_TO_FILES);

  const readTasks = [];

  for (const name in files) {
    if (files.hasOwnProperty(name)) {
      readTasks.push(readSamples(samples, files, name));
    }
  }
  await Promise.all(readTasks);
  return samples;
};

module.exports = {
  getUserCount,
  getSamples,
};
