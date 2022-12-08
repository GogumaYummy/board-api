const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      this.hasMany(models.Comment, { foreignKey: 'postId' });
      this.belongsTo(models.User, { foreignKey: 'userId' });
      this.belongsToMany(models.User, {
        through: 'LikedPosts',
        as: 'userLiked',
        foreignKey: 'postId',
      });
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
      paranoid: true,
    }
  );
  return Post;
};
