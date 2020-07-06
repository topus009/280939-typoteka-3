"use strict";

const {HttpCodes} = require(`../../../../config/constants`);
const {CustomError} = require(`../../../../utils/utils`);

const usersApi = (entityName, database) => ({
  getAll() {
    return database[entityName];
  },

  findById(id) {
    const users = database[entityName];
    const user = users.find((item) => item.id === id);
    if (!user) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_USER_ID`, {id}));
    }
    return user;
  },

  getUserByName(name) {
    const users = database[entityName];
    const user = users.find((item) => item.name === name);
    if (!user) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_USER_WITH_NAME`, {name}));
    }
    return user;
  },
});

module.exports = usersApi;
