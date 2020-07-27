'use strict';

const {
  MockFilesPaths,
  ExitCodes,
} = require(`../../../../config/constants`);
const {exit} = require(`../../../utils/utils`);
const generateUsers = require(`./generate-users`);
const generateCategories = require(`./generate-categories`);
const generateArticles = require(`./generate-articles`);
const generateComments = require(`./generate-comments`);
const {getUserCount} = require(`./utils`);

const run = async (input) => {
  if (!input.length && process.env.COUNT) {
    input = [process.env.COUNT];
  }
  const count = getUserCount(input);
  const users = await generateUsers(MockFilesPaths.USERS);
  const categories = await generateCategories(MockFilesPaths.CATEGORIES);
  const articles = await generateArticles(MockFilesPaths.ARTICLES, count, categories);
  await generateComments(MockFilesPaths.COMMENTS, count, users, articles);
  exit(ExitCodes.SUCCESS);
};

module.exports = {
  name: `--generate`,
  run
};

// run([4]); // for debugging
