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
      "avatarSmall": {
        type: DataTypes.TEXT,
        allowNull: true,
        field: `avatarSmall`,
      },
    }, {
      sequelize,
      tableName: `users`,
      timestamps: false,
      underscored: false
    });
  }

  static associate(models) {
    this.usersComments = this.hasMany(models.Comment, {
      as: `comments`,
      foreignKey: `userId`,
      onUpdate: `cascade`,
      onDelete: `cascade`
    });
  }
}

module.exports = User;
