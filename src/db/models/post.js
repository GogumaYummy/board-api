const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      models.Post.hasMany(models.Comment, { foreignKey: 'postId' });
      models.Post.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Post.init(
    {
      postId: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      title: DataTypes.STRING,
      content: DataTypes.STRING,
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'Post',
    }
  );
  return Post;
};
