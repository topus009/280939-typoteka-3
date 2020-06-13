'use strict';

const {nanoid} = require(`nanoid`);
const {
  getRandomString,
  writeToFileAsync,
} = require(`../../../../utils/utils`);
const {getSamples} = require(`./utils`);
const {PATH_TO_MOCKDATA} = require(`../../../../config/constants`);

const FILE_NAME = PATH_TO_MOCKDATA + `/users.json`;

const generateData = async (count) => {
  const samples = await getSamples();

  const data = Array(count)
    .fill({})
    .map(() => {
      return {
        id: nanoid(),
        name: getRandomString(samples.users),
        avatar: getRandomString(samples.avatars),
        avatarSmall: getRandomString(samples.avatarsSmall),
      };
    });

  // добавление меня любимого
  data.push({
    "id": `vdf45y45dfbvd`,
    "name": `Topolov Sergey`,
    "avatar": `https://avatars0.githubusercontent.com/u/22383491?s=88&u=db063b8130d3a29442c041b5720662aa78d45e78&v=4`,
    "avatarSmall": `https://avatars0.githubusercontent.com/u/22383491?s=40&v=4`
  });

  return data;
};

const generateUsers = async () => {
  const count = 10;
  const content = await generateData(count);
  await writeToFileAsync(``, FILE_NAME, JSON.stringify(content));
};

module.exports = generateUsers;
