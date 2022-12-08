const ApiError = require('../utils/apiError.js');
const { Post, Comment, User } = require('../db/models');

exports.createComment = async (req, res, next) => {
  try {
    const { comment } = req.body;
    const { postId } = req.params;
    const { userId } = res.locals;

    const post = await Post.findByPk(postId);
    const user = await User.findByPk(userId);

    if (!post || !user) throw new Error();

    await Comment.create({ comment, postId, userId });

    res.status(201).json({ message: '댓글을 작성하였습니다.' });
  } catch (err) {
    if (!(err instanceof ApiError)) err.message = '댓글 작성에 실패하였습니다.';
    next(err);
  }
};

exports.readComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.findAll({
      where: { postId },
      attributes: ['commentId', 'userId', 'comment', 'createdAt', 'updatedAt'],
      include: {
        model: User,
        attributes: ['nickname'],
      },
      order: [['commentId', 'DESC']],
      raw: true,
    });

    comments.forEach((comment) => {
      comment.nickname = comment['User.nickname'];
      delete comment['User.nickname'];
    });

    res.status(201).json({ data: comments });
  } catch (err) {
    if (!(err instanceof ApiError)) err.message = '댓글 조회에 실패하였습니다.';
    next(err);
  }
};

exports.updateComment = async (req, res, next) => {
  try {
    const { comment } = req.body;
    const { commentId } = req.params;
    const { userId } = res.locals;

    if (isNaN(commentId))
      throw new ApiError(412, '데이터 형식이 올바르지 않습니다.');

    const exitsComment = await Comment.findByPk(commentId);
    const user = await User.findByPk(userId);

    if (exitsComment.userId !== user.userId) throw new Error();

    if (!exitsComment) throw new ApiError(404, '댓글이 존재하지 않습니다.');

    await exitsComment.update({ comment });

    res.status(200).json({ message: '댓글을 수정하였습니다.' });
  } catch (err) {
    if (!(err instanceof ApiError)) err.message = '댓글 수정에 실패하였습니다.';
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { userId } = res.locals;

    if (isNaN(commentId))
      throw new ApiError(400, '데이터 형식이 올바르지 않습니다.');

    const comment = await Comment.findByPk(commentId);
    const user = await User.findByPk(userId);

    if (comment.userId !== user.userId) throw new Error();

    if (!comment) throw new ApiError(404, '댓글이 존재하지 않습니다.');

    await comment.destroy();

    res.status(200).json({ message: '댓글을 삭제하였습니다.' });
  } catch (err) {
    if (!(err instanceof ApiError)) err.message = '댓글 삭제에 실패하였습니다.';
    next(err);
  }
};
