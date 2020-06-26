"use strict";

const dbConnection = require(`../db/db`);
const users = require(`./users`);
const categories = require(`./categories`);
const posts = require(`./posts`);
const comments = require(`./comments`);

const apis = {
  users,
  categories,
  posts,
  comments,
};

const connectApiWithDB = (api, dataBase, connectedApis) => {
  Object.keys(api).forEach((apiPath) => {
    connectedApis[apiPath] = api[apiPath](apiPath, dataBase, api);
  });
};

module.exports = async () => {
  const connectedApis = {};
  const dataBase = await dbConnection();
  connectApiWithDB(apis, dataBase, connectedApis);
  return connectedApis;
};
