"use strict";

const usersApi = (entityName, DB) => ({
  getAll() {
    return DB[entityName];
  },

  findById(id) {
    const user = DB[entityName].find((item) => item.id === id);
    return user ? user : null;
  },

  getUserByName(name) {
    const users = DB[entityName];
    return users.find((item) => item.name === name);
  },
});

module.exports = usersApi;
