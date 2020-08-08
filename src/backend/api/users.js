"use strict";

const bcrypt = require(`bcrypt`);
const {Op} = require(`sequelize`);
const {
  HttpCodes,
  UsersRoles,
} = require(`../../../config/constants`);
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

  async findByEmail(email) {
    return await database[entityName].findOne({
      where: {
        email: {
          [Op.like]: `%${email}%`
        }
      }
    });
  },

  async add(data) {
    delete data.passwordConfirmation;
    const {password, ...userData} = data;
    const hash = await bcrypt.hash(password, +process.env.PASSWORD_SALT);
    return await database[entityName].create({
      ...userData,
      password: hash,
      role: UsersRoles.READER,
    });
  },
});

module.exports = usersApi;
