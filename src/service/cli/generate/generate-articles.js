'use strict';

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
        "id": id + 1,
        "title": getRandomString(samples.titles),
        'created_date': getRandomDate(),
        "announce": sentences.slice(0, 5).join(` `),
        "sentences": sentences.join(` `),
        "categories": getRandomStrings(categoriesIds, 3).slice(0, 3),
      };

      if (id % 5 !== 0) {
        content.img = `img/articles/sea@1x.jpg`;
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
