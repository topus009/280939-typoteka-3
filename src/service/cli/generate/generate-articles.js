'use strict';

const {nanoid} = require(`nanoid`);
const {
  getRandomDate,
  getRandomString,
  getRandomStrings,
  writeToFileAsync,
} = require(`../../../utils/utils`);
const {getSamples} = require(`./utils`);

const generateMockData = async (count, categories) => {
  const samples = await getSamples();

  let imageCount = 1;

  const data = Array(count)
    .fill({})
    .map(() => {
      const sentences = getRandomStrings(samples.sentences);
      const categoriesIds = categories.map((category) => category.id);

      const content = {
        id: nanoid(),
        title: getRandomString(samples.titles),
        createdDate: getRandomDate(),
        announce: sentences.slice(0, 5).join(` `),
        sentences: sentences.join(` `),
        categories: getRandomStrings(categoriesIds, 3).slice(0, 3),
      };

      if (imageCount % 5 !== 0) {
        content.img = `img/articles/sea@1x.jpg`;
      }

      imageCount++;
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
