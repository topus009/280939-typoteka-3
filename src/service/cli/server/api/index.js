"use strict";

const db = require(`../db/db`);
const users = require(`./users`);
const categories = require(`./categories`);
const posts = require(`./posts`);
const comments = require(`./comments`);

const api = {
  users,
  categories,
  posts,
  comments,
};

const connectApiWithDB = (_api, dataBase, connectedApis) => {
  Object.keys(_api).forEach((apiPath) => {
    connectedApis[apiPath] = _api[apiPath](apiPath, dataBase, _api);
  });
};

module.exports = async () => {
  const connectedApis = {};
  const store = await db();
  connectApiWithDB(api, store, connectedApis);
  return connectedApis;
};
