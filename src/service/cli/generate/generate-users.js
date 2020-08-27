'use strict';

const bcrypt = require(`bcrypt`);
const {
  MY_FIRSTNAME,
  MY_LASTNAME,
  MY_EMAIL,
  UsersRoles,
  GENERATE_USERS_MAX_COUNT,
  ADMIN_ID,
  GENERATE_ADMIN_AVATAR,
  GENERATE_ADMIN_AVATAR_SMALL,
} = require(`../../../../config/constants`);
const {
  getRandomString,
  writeToFileAsync,
} = require(`../../../utils/utils`);
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
    id: ADMIN_ID,
    firstName: MY_FIRSTNAME,
    lastName: MY_LASTNAME,
    email: MY_EMAIL,
    password: myPassword,
    role: UsersRoles.ADMIN,
    avatar: GENERATE_ADMIN_AVATAR,
    avatarSmall: GENERATE_ADMIN_AVATAR_SMALL,
  });
  return data;
};

const generateUsers = async (fileName) => {
  const data = await generateData(GENERATE_USERS_MAX_COUNT);
  await writeToFileAsync(``, fileName, JSON.stringify(data));
  return data;
};

module.exports = generateUsers;
