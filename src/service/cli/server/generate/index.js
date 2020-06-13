'use strict';

const {exit} = require(`../../../../utils/utils`);
const {getUserCount} = require(`./utils`);
const generateComments = require(`./generateComments`);
const generateUsers = require(`./generateUsers`);
const generatePosts = require(`./generatePosts`);
const generateCategories = require(`./generateCategories`);

const run = async (input) => {
  const count = getUserCount(input);
  await generateUsers();
  await generateCategories();
  const users = require(`../../../../../mockData/users.json`);
  const categories = require(`../../../../../mockData/categories.json`);
  await generatePosts(count, users, categories);
  const posts = require(`../../../../../mockData/mocks.json`);
  await generateComments(count, users, posts);
  exit(`SUCCESS`);
};

module.exports = {
  name: `--generate`,
  run
};

// run([30]); // for debugging
