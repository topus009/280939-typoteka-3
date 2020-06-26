'use strict';

const {nanoid} = require(`nanoid`);
const {
  getRandomDate,
  getRandomString,
  writeToFileAsync,
} = require(`../../../utils/utils`);
const {getSamples} = require(`./utils`);

const generateData = async (count, users, posts) => {
  const samples = await getSamples();

  const usersIds = users.map((user) => user.id);
  const postsIds = posts.map((post) => post.id);

  const data = {};

  for (let i = 0; i <= count; i++) {
    const postId = getRandomString(postsIds);
    if (!data[postId]) {
      data[postId] = [];
    }
    data[postId].push({
      id: nanoid(),
      userId: getRandomString(usersIds),
      text: getRandomString(samples.comments),
      createdDate: getRandomDate(),
    });
  }

  return data;
};

const generateComments = async (fileName, count, users, posts) => {
  const data = await generateData(count * 3, users, posts);
  await writeToFileAsync(``, fileName, JSON.stringify(data));
  return data;
};

module.exports = generateComments;
