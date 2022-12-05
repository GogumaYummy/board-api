const { Router } = require('express');
const jwt = require('jsonwebtoken');
const { BaseError } = require('sequelize');

const ApiError = require('../utils/error');
const { Post, User } = require('../db/models');
const { isLoggedIn } = require('../middlewares/auth');

const router = Router();

router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const { userId } = jwt.decode(req.cookies.accessToken);

    if (!title && !content)
      throw new ApiError(412, '데이터 형식이 올바르지 않습니다.');
    else {
      if (!title)
        throw new ApiError(412, '게시글 제목의 형식이 일치하지 않습니다.');
      if (!content)
        throw new ApiError(412, '게시글 내용의 형식이 일치하지 않습니다.');
    }

    const user = await User.findByPk(userId);

    await Post.create({ title, content, userId: user.userId });

    res.status(201).json({ message: '게시글 작성에 성공하였습니다.' });
  } catch (err) {
    if (err instanceof ApiError) next(err);
    else next(new ApiError(400, '게시글 작성에 실패하였습니다.', err.stack));
  }
});

router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      attributes: ['postId', 'userId', 'title', 'createdAt', 'updatedAt'],
      include: {
        model: User,
        attributes: ['nickname'],
      },
      order: [['postId', 'DESC']],
      raw: true,
    });

    posts.forEach((post) => {
      post.nickname = post['User.nickname'];
      delete post['User.nickname'];
    });

    res.status(200).json({ data: posts });
  } catch (err) {
    if (err instanceof ApiError) next(err);
    else next(new ApiError(400, '게시글 조회에 실패하였습니다.', err.stack));
  }
});

router.get('/:postId', async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByPk(postId, {
      include: {
        model: User,
        attributes: ['nickname'],
      },
      raw: true,
    });

    post.nickname = post['User.nickname'];
    delete post['User.nickname'];

    res.status(200).json({ data: post });
  } catch (err) {
    if (err instanceof ApiError) next(err);
    else next(new ApiError(400, '게시글 조회에 실패하였습니다.', err.stack));
  }
});

router.put('/:postId', isLoggedIn, async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const { postId } = req.params;
    const { userId } = jwt.decode(req.cookies.accessToken);

    if ((!title && !content) || isNaN(postId))
      throw new ApiError(412, '데이터 형식이 올바르지 않습니다.');
    else {
      if (!title)
        throw new ApiError(412, '게시글 제목의 형식이 일치하지 않습니다.');
      if (!content)
        throw new ApiError(412, '게시글 내용의 형식이 일치하지 않습니다.');
    }

    const post = await Post.findByPk(postId);
    const user = await User.findByPk(userId);

    if (post.userId !== user.userId) throw new Error();

    await post.update({ title, content });

    res.status(200).json({ message: '게시글을 수정하였습니다.' });
  } catch (err) {
    if (err instanceof ApiError) next(err);
    else if (err instanceof BaseError)
      next(
        new ApiError(401, '게시글이 정상적으로 수정되지 않았습니다.', err.stack)
      );
    else next(new ApiError(400, '게시글 수정에 실패하였습니다.', err.stack));
  }
});

router.delete('/:postId', isLoggedIn, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { userId } = jwt.decode(req.cookies.accessToken);

    const post = await Post.findByPk(postId);
    const user = await User.findByPk(userId);

    if (!post) throw new ApiError(404, '게시글이 존재하지 않습니다.');
    if (post.userId !== user.userId) throw new Error();

    await Post.destroy({ where: { postId } });

    res.status(200).json({ message: '게시글을 삭제하였습니다.' });
  } catch (err) {
    if (err instanceof ApiError) next(err);
    else if (err instanceof BaseError)
      next(new ApiError(401, '게시글이 정상적으로 삭제되지 않았습니다.'));
    else next(new ApiError(400, '게시글 작성에 실패하였습니다.', err.stack));
  }
});

module.exports = router;
