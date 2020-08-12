"use strict";

const bcrypt = require(`bcrypt`);
const {Op} = require(`sequelize`);
const {
  HttpCodes,
  UsersRoles,
} = require(`../../../config/constants`);
const {
  CustomError,
  sqlzParse,
} = require(`../../utils/utils`);

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
      avatar: userData.avatar || `img/icons/smile.svg`,
      avatarSmall: userData.avatarSmall || `img/icons/smile.svg`,
    });
  },

  async auth({email, password}) {
    const user = await database[entityName].scope(`withPassword`).findOne({
      where: {
        email: {
          [Op.like]: `%${email}%`
        }
      }
    });
    if (!user) {
      throw new CustomError(HttpCodes.BAD_REQUEST, _f(`USER_WITH_EMAIL_NOT_EXISTS`, {email}));
    }
    const {password: userPassword, id} = sqlzParse(user);
    const isPasswordMatch = await bcrypt.compare(password, userPassword);
    if (!isPasswordMatch) {
      throw new CustomError(HttpCodes.BAD_REQUEST, _f(`PASSWORD_IS_INCORRECT`));
    }
    return id;
  }
});

module.exports = usersApi;
