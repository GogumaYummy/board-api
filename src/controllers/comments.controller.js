const { Router } = require('express');
const jwt = require('jsonwebtoken');

const ApiError = require('../utils/error');
const { Post, Comment, User } = require('../db/models');
const { isLoggedIn } = require('../middlewares/auth');

exports.createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const { userId } = jwt.decode(req.cookies.accessToken);

    if (!content || isNaN(postId))
      throw new ApiError(412, '데이터 형식이 올바르지 않습니다.');

    const post = await Post.findByPk(postId);
    const user = await User.findByPk(userId);

    await Comment.create({ content, postId: post.postId, userId: user.userId });

    res.status(201).json({ message: '댓글을 작성하였습니다.' });
  } catch (err) {
    if (err instanceof ApiError) next(err);
    else next(new ApiError(400, '댓글 작성에 실패하였습니다.', err.stack));
  }
};

exports.readComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.findAll({
      where: { postId },
      attributes: ['commentId', 'userId', 'content', 'createdAt', 'updatedAt'],
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
    if (err instanceof ApiError) next(err);
    else next(new ApiError(400, '댓글 조회에 실패하였습니다.', err.stack));
  }
};

exports.updateComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const { commentId } = req.params;
    const { userId } = jwt.decode(req.cookies.accessToken);

    if (!content || isNaN(commentId))
      throw new ApiError(412, '데이터 형식이 올바르지 않습니다.');

    const comment = await Comment.findByPk(commentId);
    const user = await User.findByPk(userId);

    if (comment.userId !== user.userId) throw new Error();

    if (!comment) throw new ApiError(404, '댓글이 존재하지 않습니다.');

    await comment.update({ content });

    res.status(200).json({ message: '댓글을 수정하였습니다.' });
  } catch (err) {
    if (err instanceof ApiError) next(err);
    else if (err instanceof BaseError)
      next(new ApiError(401, '댓글 수정이 정상적으로 처리되지 않았습니다.'));
    else next(new ApiError(400, '댓글 수정에 실패하였습니다.', err.stack));
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { userId } = jwt.decode(req.cookies.accessToken);

    if (isNaN(commentId))
      throw new ApiError(400, '데이터 형식이 올바르지 않습니다.');

    const comment = await Comment.findByPk(commentId);
    const user = await User.findByPk(userId);

    if (comment.userId !== user.userId) throw new Error();

    if (!comment) throw new ApiError(404, '댓글이 존재하지 않습니다.');

    await comment.destroy();

    res.status(200).json({ message: '댓글을 삭제하였습니다.' });
  } catch (err) {
    if (err instanceof ApiError) next(err);
    else if (err instanceof BaseError)
      next(new ApiError(401, '댓글 삭제가 정상적으로 처리되지 않았습니다.'));
    else next(new ApiError(400, '댓글 삭제에 실패하였습니다.', err.stack));
  }
};
