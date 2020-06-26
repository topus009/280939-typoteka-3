"use strict";

const {HttpCodes} = require(`../../../../config/constants`);
const {Err} = require(`../../../../utils/utils`);

const usersApi = (entityName, dataBase) => ({
  getAll() {
    return dataBase[entityName];
  },

  findById(id) {
    const users = dataBase[entityName];
    const user = users.find((item) => item.id === id);
    if (!user) {
      throw new Err(HttpCodes.NOT_FOUND, _f(`NO_USER_ID`));
    }
    return user;
  },

  getUserByName(name) {
    const users = dataBase[entityName];
    const user = users.find((item) => item.name === name);
    if (!user) {
      throw new Err(HttpCodes.NOT_FOUND, _f(`NO_USER_WITH_NAME`, {name}));
    }
    return user;
  },
});

module.exports = usersApi;
