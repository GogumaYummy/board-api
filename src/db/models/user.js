'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      models.User.hasMany(models.Post, { foreignKey: 'userId' });
      models.User.hasMany(models.Comment, { foreignKey: 'userId' });
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
    }
  );
  return User;
};
