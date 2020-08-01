"use strict";

const {Op} = require(`sequelize`);
const {HttpCodes} = require(`../../../config/constants`);
const {CustomError} = require(`../../utils/utils`);

const usersApi = (entityName, database) => ({
  async getAll() {
    return await database[entityName].findAll();
  },

  async findById(id) {
    try {
      const user = await database[entityName].findByPk(+id);
      if (!user) {
        throw new CustomError(HttpCodes.NOT_FOUND, _f(`NO_USER_ID`, {id}));
      }
      return user;
    } catch (error) {
      return error;
    }
  },

  async getUserByName(name) {
    try {
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
    } catch (error) {
      return error;
    }
  },
});

module.exports = usersApi;
