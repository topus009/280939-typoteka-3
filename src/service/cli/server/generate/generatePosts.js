'use strict';

const {nanoid} = require(`nanoid`);
const {
  getRandomDate,
  getRandomString,
  getRandomStrings,
  writeToFileAsync,
} = require(`../../../../utils/utils`);
const {getSamples} = require(`./utils`);
const {PATH_TO_MOCKDATA} = require(`../../../../config/constants`);

const FILE_NAME = PATH_TO_MOCKDATA + `/mocks.json`;

const generateMockData = async (count, users, categories) => {
  const samples = await getSamples();

  let imageCount = 1;

  const usersIds = users.map((user) => user.id);

  const data = Array(count)
    .fill({})
    .map(() => {
      const sentences = getRandomStrings(samples.sentences);
      const categoriesIds = categories.map((category) => category.id);

      const content = {
        id: nanoid(),
        title: getRandomString(samples.titles),
        userId: getRandomString(usersIds),
        createdDate: getRandomDate(),
        announce: sentences.slice(0, 5).join(` `),
        sentences: sentences.join(` `),
        categories: getRandomStrings(categoriesIds, 3).slice(0, 3),
      };

      if (imageCount % 5 !== 0) {
        content.img = `img/sea@1x.jpg`;
        content.imgBig = `img/sea@2x.jpg 2x`;
      }

      imageCount++;
      return content;
    });

  return data;
};

const generatePosts = async (count, users, categories) => {
  const content = await generateMockData(count, users, categories);
  await writeToFileAsync(``, FILE_NAME, JSON.stringify(content));
};

module.exports = generatePosts;
