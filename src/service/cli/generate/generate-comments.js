'use strict';

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

  const data = [];

  for (let id = 0; id <= count; id++) {
    data.push({
      "id": id + 1,
      'article_id': getRandomString(articlesIds),
      'user_id': getRandomString(usersIds),
      "comment": getRandomString(samples.comments),
      'created_date': getRandomDate(),
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
