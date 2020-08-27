'use strict';

const {Model} = require(`sequelize`);
const {sqlzParse} = require(`../../../utils/utils`);

class User extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        autoIncrementIdentity: true,
        primaryKey: true,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      role: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      avatar: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      avatarSmall: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: `avatarSmall`,
      },
    }, {
      defaultScope: {
        attributes: {exclude: [`password`]},
      },
      scopes: {
        withPassword: {
          attributes: {include: [`password`]},
        },
      },
      sequelize,
      tableName: `users`,
      timestamps: false,
      underscored: false,
      hooks: {
        afterFind: (result) => sqlzParse(result),
        afterCreate: (result) => {
          delete result.dataValues.password;
          return result;
        },
      },
    });
  }

  static associate(models) {
    this.usersComments = this.hasMany(models.Comment, {
      as: `comments`,
      foreignKey: `userId`,
      onUpdate: `cascade`,
      onDelete: `cascade`,
    });
  }
}

module.exports = User;
