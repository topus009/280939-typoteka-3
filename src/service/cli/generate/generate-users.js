'use strict';

const bcrypt = require(`bcrypt`);
const {
  getRandomString,
  writeToFileAsync,
} = require(`../../../utils/utils`);
const {
  MY_FIRSTNAME,
  MY_LASTNAME,
  MY_EMAIL,
  UsersRoles,
} = require(`../../../../config/constants`);
const {getSamples} = require(`./utils`);

const generateData = async (count) => {
  const samples = await getSamples();

  let id = 1;

  let emails = samples.emails;
  const password = await bcrypt.hash(`password`, +process.env.PASSWORD_SALT);

  const data = Array(count)
    .fill({})
    .map(() => {
      id++;
      const email = getRandomString(emails);
      emails = emails.filter((item) => item !== email);
      return {
        id,
        firstName: getRandomString(samples.users_firstname),
        lastName: getRandomString(samples.users_lastname),
        email,
        password,
        role: UsersRoles.READER,
        avatar: getRandomString(samples.avatars),
        avatarSmall: getRandomString(samples.avatars_small),
      };
    });

  // add myself
  const myPassword = await bcrypt.hash(process.env.MY_PASSWORD, +process.env.PASSWORD_SALT);
  data.unshift({
    id: 1,
    firstName: MY_FIRSTNAME,
    lastName: MY_LASTNAME,
    email: MY_EMAIL,
    password: myPassword,
    role: UsersRoles.ADMIN,
    avatar: `https://avatars0.githubusercontent.com/u/22383491?s=88&u=db063b8130d3a29442c041b5720662aa78d45e78&v=4`,
    avatarSmall: `https://avatars0.githubusercontent.com/u/22383491?s=40&v=4`
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
