'use strict';

const {Model} = require(`sequelize`);

class User extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      "id": {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        autoIncrementIdentity: true,
        primaryKey: true,
        allowNull: false
      },
      "name": {
        type: DataTypes.TEXT,
        allowNull: false
      },
      "avatar": {
        type: DataTypes.TEXT,
        allowNull: true
      },
      "avatar_small": {
        type: DataTypes.TEXT,
        allowNull: true
      },
    }, {
      sequelize,
      tableName: `users`,
      timestamps: false
    });
  }

  static associate(models) {
    this.usersComments = this.hasMany(models.Comment, {
      as: `comments`,
      foreignKey: `user_id`,
      onUpdate: `cascade`,
      onDelete: `cascade`
    });
  }
}

module.exports = User;
