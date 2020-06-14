'use strict';

const {PATH_TO_MOCKDATA} = require(`../../../config/constants`);
const {exit} = require(`../../../utils/utils`);
const generateUsers = require(`./generateUsers`);
const generateCategories = require(`./generateCategories`);
const generatePosts = require(`./generatePosts`);
const generateComments = require(`./generateComments`);
const {getUserCount} = require(`./utils`);

const fileNames = {
  USERS: `${PATH_TO_MOCKDATA}/users.json`,
  CATEGORIES: `${PATH_TO_MOCKDATA}/categories.json`,
  MOCKS: `${PATH_TO_MOCKDATA}/mocks.json`,
  COMMENTS: `${PATH_TO_MOCKDATA}/comments.json`,
};

const run = async (input) => {
  const count = getUserCount(input);
  await generateUsers(fileNames.USERS);
  await generateCategories(fileNames.CATEGORIES);
  const users = require(`../../../../mockData/users.json`);
  const categories = require(`../../../../mockData/categories.json`);
  await generatePosts(fileNames.MOCKS, count, users, categories);
  const posts = require(`../../../../mockData/mocks.json`);
  await generateComments(fileNames.COMMENTS, count, users, posts);
  exit(`SUCCESS`);
};

module.exports = {
  name: `--generate`,
  run
};

// run([30]); // for debugging
