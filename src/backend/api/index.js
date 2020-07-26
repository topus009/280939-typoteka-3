"use strict";

const dbConnection = require(`../database/database`);
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

const connectApiWithDB = (api, database, connectedApis) => {
  Object.keys(api).forEach((apiPath) => {
    connectedApis[apiPath] = api[apiPath](apiPath, database, api);
  });
};

module.exports = async () => {
  const connectedApis = {};
  const database = await dbConnection();
  connectApiWithDB(apis, database, connectedApis);
  return connectedApis;
};
