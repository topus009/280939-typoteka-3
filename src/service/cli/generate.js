'use strict';

const {
  exit,
  getRandomDate,
  getRandomString,
  getRandomStrings,
  readFileAsync,
  writeToFileAsync,
} = require(`../../utils/utils`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mock.json`;
const MAX_ITEMS_ALLOWED = 1000;

const getUserCount = (paramValueArr) => {
  const parsedCount = parseInt(paramValueArr[0], 10);

  if (isNaN(parsedCount)) {
    console.error(`Вы не указали параметры или они не валидны. Будет создана 1 запись.`);

    return DEFAULT_COUNT;
  } else if (parsedCount > MAX_ITEMS_ALLOWED) {
    console.error(`Возможно создать не больше ${MAX_ITEMS_ALLOWED} записей`);
    exit(`error`);
  }

  return parsedCount;
};

const generateMockData = async (count) => {
  const titlesSamples = await readFileAsync(`src/samples/title.txt`);
  const announceSamples = await readFileAsync(`src/samples/announce.txt`);
  const categorySamples = await readFileAsync(`src/samples/category.txt`);


  const data = Array(count)
    .fill({})
    .map(() => {
      const fullText = getRandomStrings(announceSamples);
      const category = getRandomStrings(categorySamples);

      return {
        title: getRandomString(titlesSamples),
        createdDate: getRandomDate(),
        announce: fullText.slice(0, 5).join(` `),
        fullText: fullText.join(` `),
        category: category.slice(0, 3),
      };
    });

  return data;
};

const run = async (input) => {
  const count = getUserCount(input);
  const content = await generateMockData(count);
  await writeToFileAsync(``, FILE_NAME, JSON.stringify(content));
  exit(`success`);
};

module.exports = {
  name: `--generate`,
  run
};

// run([1]); // for debugging
