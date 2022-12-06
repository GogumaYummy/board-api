const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      this.belongsTo(models.Post, { foreignKey: 'postId' });
      this.belongsTo(models.User, { foreignKey: 'userId' });
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
