const { Router } = require('express');
const bcrypt = require('bcrypt');
const Comments = require('../schemas/comment');
const { isValidObjectId } = require('mongoose');
const ApiError = require('../utils/error');

const router = Router();

router.post('/:postId', async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { user, password, content } = req.body;

    if (!user || !password || !isValidObjectId(postId))
      throw new ApiError(400, '데이터 형식이 올바르지 않습니다.');

    if (!content) throw new ApiError(400, '댓글 내용을 입력해주세요.');

    const hashed = await bcrypt.hash(password, 12);

    const document = {
      user,
      password: hashed,
      content,
      postId,
    };

    await Comments.create(document);

    res.status(201).json({ message: '댓글을 생성하였습니다.' });
  } catch (err) {
    next(err);
  }
});

router.get('/:postId', async (req, res, next) => {
  try {
    const { postId } = req.params;

    if (!isValidObjectId(postId))
      throw new ApiError(400, '데이터 형식이 올바르지 않습니다.');

    const filter = { postId };
    const projection = { user: 1, content: 1, createdAt: 1 };
    const options = { sort: { createdAt: -1 } };
    const rawData = await Comments.find(filter, projection, options);

    const result = rawData.map(({ _id, user, content, createdAt }) => {
      return { commentId: _id, user, content, createdAt };
    });

    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
});

router.put('/:commentId', async (req, res, next) => {
  try {
    const { password, content } = req.body;
    const { commentId } = req.params;

    if (!password || !isValidObjectId(commentId))
      throw new ApiError(400, '데이터 형식이 올바르지 않습니다.');

    if (!content) throw new ApiError(400, '댓글 내용을 입력해주세요.');

    const projection = { _id: 0, password: 1 };
    const comment = await Comments.findById(commentId, projection);

    if (!comment) throw new ApiError(404, '댓글 조회에 실패하였습니다.');

    const comparisonResult = await bcrypt.compare(password, comment.password);

    if (!comparisonResult) throw new ApiError(401, '잘못된 비밀번호입니다.');

    const filter = { _id: commentId };
    const update = { content };

    await Comments.updateOne(filter, update);

    res.status(200).json({ message: '댓글을 수정하였습니다.' });
  } catch (err) {
    next(err);
  }
});

router.delete('/:commentId', async (req, res, next) => {
  try {
    const { password } = req.body;
    const { commentId } = req.params;

    if (!password || !isValidObjectId(commentId))
      throw new ApiError(400, '데이터 형식이 올바르지 않습니다.');

    const projection = { _id: 0, password: 1 };
    const comment = await Comments.findById(commentId, projection);

    if (!comment) throw new ApiError(404, '댓글 조회에 실패하였습니다.');

    const comparisonResult = await bcrypt.compare(password, comment.password);

    if (!comparisonResult) throw new ApiError(401, '잘못된 비밀번호입니다.');

    const filter = { _id: commentId };

    await Comments.deleteOne(filter);

    res.status(200).json({ message: '댓글을 삭제하였습니다.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
