'use strict';

const {Model} = require(`sequelize`);

class Article extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      "id": {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        autoIncrementIdentity: true,
        primaryKey: true,
        allowNull: false
      },
      "title": {
        type: DataTypes.TEXT,
        allowNull: false
      },
      "created_date": {
        type: DataTypes.TEXT,
        allowNull: false
      },
      "announce": {
        type: DataTypes.TEXT,
        allowNull: false
      },
      "sentences": {
        type: DataTypes.TEXT,
        allowNull: true
      },
      "img": {
        type: DataTypes.TEXT,
        allowNull: true
      },
    }, {
      sequelize,
      tableName: `articles`,
      timestamps: false
    });
  }

  static associate(models) {
    this.articlesComments = this.hasMany(models.Comment, {
      as: `comments`,
      foreignKey: `article_id`,
      onUpdate: `cascade`,
      onDelete: `cascade`
    });
    this.articlesCategories = this.belongsToMany(models.Category, {
      through: `articles_categories`,
      as: `categories`,
      foreignKey: `article_id`,
      timestamps: false,
      paranoid: false,
    });
  }
}

module.exports = Article;
