'use strict';

const {
  getRandomString,
  writeToFileAsync,
} = require(`../../../utils/utils`);
const {MY_NAME} = require(`../../../../config/constants`);
const {getSamples} = require(`./utils`);

const generateData = async (count) => {
  const samples = await getSamples();

  let currentId = 1;

  const data = Array(count)
    .fill({})
    .map(() => {
      currentId++;
      return {
        "id": currentId,
        "name": getRandomString(samples.users),
        "avatar": getRandomString(samples.avatars),
        'avatar_small': getRandomString(samples.avatars_small),
      };
    });

  // add myself
  data.unshift({
    "id": 1,
    "name": MY_NAME,
    "avatar": `https://avatars0.githubusercontent.com/u/22383491?s=88&u=db063b8130d3a29442c041b5720662aa78d45e78&v=4`,
    "avatar_small": `https://avatars0.githubusercontent.com/u/22383491?s=40&v=4`
  });

  return data;
};

const generateUsers = async (fileName) => {
  const COUNT = 10;
  const data = await generateData(COUNT);
  await writeToFileAsync(``, fileName, JSON.stringify(data));
  return data;
};

module.exports = generateUsers;
