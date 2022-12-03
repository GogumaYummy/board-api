const { Router } = require('express');
const ApiError = require('../utils/error');
const { Post, Comment } = require('../db/models');

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title || !content)
      throw new ApiError(400, '데이터 형식이 올바르지 않습니다.');

    await Post.create({ title, content });

    res.status(201).json({ message: '게시글을 생성하였습니다.' });
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res) => {
  const posts = await Post.findAll({
    attributes: ['postId', 'title', 'createdAt', 'updatedAt'],
  });

  res.status(200).json({ data: posts });
});

router.get('/:postId', async (req, res, next) => {
  try {
    const { postId } = req.params;

    if (isNaN(postId))
      throw new ApiError(400, '데이터 형식이 올바르지 않습니다.');

    const post = await Post.findByPk(postId, {
      include: {
        model: Comment,
        attributes: ['commentId', 'content', 'createdAt', 'updatedAt'],
      },
    });

    if (!post) throw new ApiError(404, '게시글 조회에 실패하였습니다.');

    res.status(200).json({ data: post });
  } catch (err) {
    next(err);
  }
});

router.put('/:postId', async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const { postId } = req.params;

    if (!title || !content || isNaN(postId))
      throw new ApiError(400, '데이터 형식이 올바르지 않습니다.');

    const post = await Post.findByPk(postId);

    if (!post) throw new ApiError(404, '게시글 조회에 실패하였습니다.');

    await post.update({ title, content });

    res.status(200).json({ message: '게시글을 수정하였습니다.' });
  } catch (err) {
    next(err);
  }
});

router.delete('/:postId', async (req, res, next) => {
  try {
    const { postId } = req.params;

    if (isNaN(postId))
      throw new ApiError(400, '데이터 형식이 올바르지 않습니다.');

    const post = await Post.findByPk(postId);

    if (!post) throw new ApiError(404, '게시글 조회에 실패하였습니다.');

    await Post.destroy({ where: { postId } });

    res.status(200).json({ message: '게시글을 삭제하였습니다.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
