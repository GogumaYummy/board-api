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
      comment: DataTypes.STRING,
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'Comment',
      paranoid: true,
    }
  );
  return Comment;
};
