const { Router } = require('express');
const ApiError = require('../utils/error');
const { Post } = require('../db/models');
const { BaseError } = require('sequelize');

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    console.log(req.body);
    const { title, content } = req.body;

    if (!title && !content)
      throw new ApiError(412, '데이터 형식이 올바르지 않습니다.');
    else {
      if (!title)
        throw new ApiError(412, '게시글 제목의 형식이 일치하지 않습니다.');
      if (!content)
        throw new ApiError(412, '게시글 내용의 형식이 일치하지 않습니다.');
    }

    await Post.create({ title, content });

    res.status(201).json({ message: '게시글 작성에 성공하였습니다.' });
  } catch (err) {
    if (err instanceof ApiError) next(err);
    else next(new ApiError(400, '게시글 작성에 실패하였습니다.'));
  }
});

router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      attributes: ['postId', 'title', 'createdAt', 'updatedAt'],
      order: [['postId', 'DESC']],
    });

    res.status(200).json({ data: posts });
  } catch (err) {
    if (err instanceof ApiError) next(err);
    else next(new ApiError(400, '게시글 조회에 실패하였습니다.'));
  }
});

router.get('/:postId', async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByPk(postId);

    res.status(200).json({ data: post });
  } catch (err) {
    if (err instanceof ApiError) next(err);
    else next(new ApiError(400, '게시글 조회에 실패하였습니다.'));
  }
});

router.put('/:postId', async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const { postId } = req.params;

    if ((!title && !content) || isNaN(postId))
      throw new ApiError(412, '데이터 형식이 올바르지 않습니다.');
    else {
      if (!title)
        throw new ApiError(412, '게시글 제목의 형식이 일치하지 않습니다.');
      if (!content)
        throw new ApiError(412, '게시글 내용의 형식이 일치하지 않습니다.');
    }

    const post = await Post.findByPk(postId);

    await post.update({ title, content });

    res.status(200).json({ message: '게시글을 수정하였습니다.' });
  } catch (err) {
    if (err instanceof ApiError) next(err);
    else if (err instanceof BaseError)
      next(new ApiError(401, '게시글이 정상적으로 수정되지 않았습니다.'));
    else next(new ApiError(400, '게시글 수정에 실패하였습니다.'));
  }
});

router.delete('/:postId', async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByPk(postId);

    if (!post) throw new ApiError(404, '게시글이 존재하지 않습니다.');

    await Post.destroy({ where: { postId } });

    res.status(200).json({ message: '게시글을 삭제하였습니다.' });
  } catch (err) {
    if (err instanceof ApiError) next(err);
    else if (err instanceof BaseError)
      next(new ApiError(401, '게시글이 정상적으로 삭제되지 않았습니다.'));
    else next(new ApiError(400, '게시글 작성에 실패하였습니다.'));
  }
});

module.exports = router;
