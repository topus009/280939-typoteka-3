"use strict";

const {Op} = require(`sequelize`);
const {HttpCodes} = require(`../../../config/constants`);
const {CustomError} = require(`../../utils/utils`);

const usersApi = (entityName, database) => ({
  async getAll() {
    return await database[entityName].findAll();
  },

  async findById(id) {
    const user = await database[entityName].findByPk(id);
    if (!user) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_USER_ID`, {id}));
    }
    return user;
  },

  async getUserByName(name) {
    const user = await database[entityName].findOne({
      where: {
        name: {
          [Op.iLike]: `%${name}%`
        }
      }
    });
    if (!user) {
      throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_USER_WITH_NAME`, {name}));
    }
    return user;
  },
});

module.exports = usersApi;
