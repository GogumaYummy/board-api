const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      models.Comment.belongsTo(models.Post, { foreignKey: 'postId' });
    }
  }
  Comment.init(
    {
      commentId: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      content: DataTypes.STRING,
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'Comment',
    }
  );
  return Comment;
};
