'use strict';

const {Model} = require(`sequelize`);

class Category extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        autoIncrementIdentity: true,
        primaryKey: true,
        allowNull: false
      },
      label: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
      }
    }, {
      sequelize,
      tableName: `categories`,
      timestamps: false
    });
  }

  static associate(models) {
    this.articlesCategories = this.belongsToMany(models.Article, {
      through: `articles_categories`,
      as: `article`,
      foreignKey: `category_id`,
      timestamps: false,
      paranoid: false,
    });
  }
}

module.exports = Category;
