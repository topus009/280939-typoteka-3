"use strict";

const {DatabaseTableNames} = require(`../../../config/constants`);
const {
  database,
  connectToDatabase,
} = require(`../database/db-connection`);
const users = require(`./users`);
const categories = require(`./categories`);
const articles = require(`./articles`);
const comments = require(`./comments`);

const apis = {
  users,
  categories,
  articles,
  comments,
};

const connectApiWithDB = async (api, databaseInstance, connectedApis) => {
  const models = await databaseInstance.models;
  Object.keys(api).forEach((apiPath) => {
    connectedApis[apiPath] = api[apiPath](DatabaseTableNames[apiPath.toUpperCase()], models);
  });
};

module.exports = async () => {
  const connectedApis = {};
  await connectToDatabase();
  connectApiWithDB(apis, database, connectedApis);
  return connectedApis;
};
