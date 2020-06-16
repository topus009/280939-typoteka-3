"use strict";

const axios = require(`../axios`);

module.exports = {
  getAll() {
    return axios.get(`/users`).then((res) => res.data);
  },

  async getUserByName(name) {
    const users = await this.getAll();
    return users.find((item) => item.name === name);
  },
};
