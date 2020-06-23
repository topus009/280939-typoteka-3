'use strict';

const {MockFilesPaths} = require(`../../../config/constants`);
const {exit} = require(`../../../utils/utils`);
const generateUsers = require(`./generateUsers`);
const generateCategories = require(`./generateCategories`);
const generatePosts = require(`./generatePosts`);
const generateComments = require(`./generateComments`);
const {getUserCount} = require(`./utils`);

const run = async (input) => {
  const count = getUserCount(input);
  const users = await generateUsers(MockFilesPaths.USERS);
  const categories = await generateCategories(MockFilesPaths.CATEGORIES);
  const posts = await generatePosts(MockFilesPaths.POSTS, count, users, categories);
  await generateComments(MockFilesPaths.COMMENTS, count, users, posts);
  exit(`SUCCESS`);
};

module.exports = {
  name: `--generate`,
  run
};

// run([30]); // for debugging
