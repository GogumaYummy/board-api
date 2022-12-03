const { Router } = require('express');
const bcrypt = require('bcryptjs');
const Comments = require('../schemas/comment');
const { isValidObjectId } = require('mongoose');
const ApiError = require('../utils/error');
const { Post, Comment } = require('../db/models');

const router = Router();

router.post('/:postId', async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || isNaN(postId))
      throw new ApiError(400, '데이터 형식이 올바르지 않습니다.');

    const post = await Post.findByPk(postId);

    if (!post) throw new ApiError(404, '게시글 조회에 실패하였습니다.');

    await Comment.create({ content, postId: post.postId });

    res.status(201).json({ message: '댓글을 생성하였습니다.' });
  } catch (err) {
    next(err);
  }
});

router.put('/:commentId', async (req, res, next) => {
  try {
    const { content } = req.body;
    const { commentId } = req.params;

    if (!content || isNaN(commentId))
      throw new ApiError(400, '데이터 형식이 올바르지 않습니다.');

    const comment = await Comment.findByPk(commentId);

    if (!comment) throw new ApiError(404, '댓글 조회에 실패하였습니다.');

    await comment.update({ content });

    res.status(200).json({ message: '댓글을 수정하였습니다.' });
  } catch (err) {
    next(err);
  }
});

router.delete('/:commentId', async (req, res, next) => {
  try {
    const { commentId } = req.params;

    if (isNaN(commentId))
      throw new ApiError(400, '데이터 형식이 올바르지 않습니다.');

    const comment = await Comment.findByPk(commentId);

    if (!comment) throw new ApiError(404, '댓글 조회에 실패하였습니다.');

    await comment.destroy();

    res.status(200).json({ message: '댓글을 삭제하였습니다.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
