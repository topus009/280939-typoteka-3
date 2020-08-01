"use strict";

const users = require(`./users`);
const categories = require(`./categories`);
const articles = require(`./articles`);
const comments = require(`./comments`);
const {
  sequelize,
  connectToDatabase,
} = require(`../database/db-connection`);

const apis = {
  users,
  categories,
  articles,
  comments,
};

const databaseTableNames = {
  users: `User`,
  categories: `Category`,
  articles: `Article`,
  comments: `Comment`,
};

const connectApiWithDB = async (api, sequelizeInstance, connectedApis) => {
  const models = await sequelizeInstance.models;
  Object.keys(api).forEach((apiPath) => {
    connectedApis[apiPath] = api[apiPath](databaseTableNames[apiPath], models);
  });
};

module.exports = async () => {
  const connectedApis = {};
  await connectToDatabase();
  connectApiWithDB(apis, sequelize, connectedApis);
  return connectedApis;
};
