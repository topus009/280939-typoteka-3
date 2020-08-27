"use strict";

const bcrypt = require(`bcrypt`);
const {Op} = require(`sequelize`);
const {
  DEFAULT_AVATAR,
  HttpCodes,
  UsersRoles,
} = require(`../../../config/constants`);
const {
  CustomError,
  sqlzParse,
} = require(`../../utils/utils`);
const fm = require(`../../utils/localization`);

const usersApi = (entityName, database) => ({
  async getAll() {
    const data = await database[entityName].findAll();
    return data;
  },

  async findById(id) {
    const user = await database[entityName].findByPk(id);
    if (!user) {
      throw new CustomError(HttpCodes.NOT_FOUND, fm(`NO_USER_ID`, {id}));
    }
    return user;
  },

  async findByEmail(email) {
    const data = await database[entityName].findOne({
      where: {
        email: {
          [Op.like]: `%${email}%`,
        },
      },
    });
    return data;
  },

  async add(data) {
    delete data.passwordConfirmation;
    const {password, ...userData} = data;
    const hash = await bcrypt.hash(password, +process.env.PASSWORD_SALT);
    const createdUser = await database[entityName].create({
      ...userData,
      password: hash,
      role: UsersRoles.READER,
      avatar: userData.avatar || DEFAULT_AVATAR,
      avatarSmall: userData.avatarSmall || DEFAULT_AVATAR,
    });
    return createdUser;
  },

  async auth({email, password}) {
    const user = await database[entityName].scope(`withPassword`).findOne({
      where: {
        email: {
          [Op.like]: `%${email}%`,
        },
      },
    });
    if (!user) {
      throw new CustomError(HttpCodes.BAD_REQUEST, fm(`USER_WITH_EMAIL_NOT_EXISTS`, {email}));
    }
    const {password: userPassword, id} = sqlzParse(user);
    const isPasswordMatch = await bcrypt.compare(password, userPassword);
    if (!isPasswordMatch) {
      throw new CustomError(HttpCodes.BAD_REQUEST, fm(`PASSWORD_IS_INCORRECT`));
    }
    return id;
  },
});

module.exports = usersApi;
