'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Post, { foreignKey: 'userId' });
      this.hasMany(models.Comment, { foreignKey: 'userId' });
      this.belongsToMany(models.Post, {
        through: 'LikedPosts',
        as: 'likedPost',
        foreignKey: 'userId',
      });
    }
  }
  User.init(
    {
      userId: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      nickname: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
      paranoid: true,
    }
  );
  return User;
};
