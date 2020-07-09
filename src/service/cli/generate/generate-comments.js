'use strict';

const {nanoid} = require(`nanoid`);
const {
  getRandomDate,
  getRandomString,
  writeToFileAsync,
} = require(`../../../utils/utils`);
const {getSamples} = require(`./utils`);

const generateData = async (count, users, articles) => {
  const samples = await getSamples();

  const usersIds = users.map((user) => user.id);
  const articlesIds = articles.map((article) => article.id);

  const data = {};

  for (let i = 0; i <= count; i++) {
    const articleId = getRandomString(articlesIds);
    if (!data[articleId]) {
      data[articleId] = [];
    }
    data[articleId].push({
      id: nanoid(),
      userId: getRandomString(usersIds),
      text: getRandomString(samples.comments),
      createdDate: getRandomDate(),
    });
  }

  return data;
};

const generateComments = async (fileName, count, users, articles) => {
  const data = await generateData(count * 3, users, articles);
  await writeToFileAsync(``, fileName, JSON.stringify(data));
  return data;
};

module.exports = generateComments;
