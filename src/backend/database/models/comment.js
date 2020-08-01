'use strict';

const {Model} = require(`sequelize`);

class Comment extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      "id": {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        autoIncrementIdentity: true,
        primaryKey: true,
        allowNull: false
      },
      "comment": {
        type: DataTypes.TEXT,
        allowNull: false
      },
      "user_id": {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      "article_id": {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      "created_date": {
        type: DataTypes.TEXT,
        allowNull: false
      },
    }, {
      sequelize,
      tableName: `comments`,
      timestamps: false
    });
  }

  static associate(models) {
    this.commentsArticles = this.belongsTo(models.Article, {
      as: `articles`,
      foreignKey: `article_id`
    });
    this.commentsUsers = this.belongsTo(models.User, {
      as: `users`,
      foreignKey: `user_id`,
      onUpdate: `cascade`,
      onDelete: `cascade`
    });
  }
}

module.exports = Comment;
