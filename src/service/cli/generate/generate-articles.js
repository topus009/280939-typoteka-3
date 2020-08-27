'use strict';

const {
  DEFAULT_ARTICLE,
  GENERATE_ANNOUNCE_MAX_COUNT,
  GENERATE_CATEGORIES_MAX_COUNT,
  GENERATE_ARTICLE_IMG_INDEX,
} = require(`../../../../config/constants`);
const {
  getRandomDate,
  getRandomString,
  getRandomStrings,
  writeToFileAsync,
} = require(`../../../utils/utils`);
const {getSamples} = require(`./utils`);

const generateMockData = async (count, categories) => {
  const samples = await getSamples();

  const data = Array(count)
    .fill({})
    .map((_, id) => {
      const sentences = getRandomStrings(samples.sentences);
      const categoriesIds = categories.map((category) => category.id);

      const content = {
        id: id + 1,
        title: getRandomString(samples.titles),
        createdDate: getRandomDate(),
        announce: sentences.slice(0, GENERATE_ANNOUNCE_MAX_COUNT).join(` `),
        sentences: sentences.join(` `),
        categories:
          getRandomStrings(categoriesIds, GENERATE_CATEGORIES_MAX_COUNT)
            .slice(0, GENERATE_CATEGORIES_MAX_COUNT),
      };

      if (id % GENERATE_ARTICLE_IMG_INDEX !== 0) {
        content.img = DEFAULT_ARTICLE;
      }
      return content;
    });
  return data;
};

const generateArticles = async (fileName, count, categories) => {
  const data = await generateMockData(count, categories);
  await writeToFileAsync(``, fileName, JSON.stringify(data));
  return data;
};

module.exports = generateArticles;
