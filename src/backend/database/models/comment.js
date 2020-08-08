'use strict';

const {Model} = require(`sequelize`);

class Comment extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        autoIncrementIdentity: true,
        primaryKey: true,
        allowNull: false
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: `userId`,
      },
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: `articleId`,
      },
      createdDate: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: `createdDate`,
      },
    }, {
      sequelize,
      tableName: `comments`,
      timestamps: false,
      underscored: false
    });
  }

  static associate(models) {
    this.commentsArticles = this.belongsTo(models.Article, {
      as: `articles`,
      foreignKey: `articleId`
    });
    this.commentsUsers = this.belongsTo(models.User, {
      as: `users`,
      foreignKey: `userId`,
      onUpdate: `cascade`,
      onDelete: `cascade`
    });
  }
}

module.exports = Comment;
