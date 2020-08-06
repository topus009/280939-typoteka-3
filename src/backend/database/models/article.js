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
      "createdDate": {
        type: DataTypes.TEXT,
        allowNull: false,
        field: `createdDate`,
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
      timestamps: false,
      underscored: false
    });
  }

  static associate(models) {
    this.articlesComments = this.hasMany(models.Comment, {
      as: `comments`,
      foreignKey: `articleId`,
      onUpdate: `cascade`,
      onDelete: `cascade`
    });
    this.articlesCategories = this.belongsToMany(models.Category, {
      through: `articles_categories`,
      as: `categories`,
      foreignKey: `articleId`,
      timestamps: false,
      paranoid: false,
    });
  }
}

module.exports = Article;
