const { Router } = require('express');
const bcrypt = require('bcrypt');
const Posts = require('../schemas/post');
const { isValidObjectId } = require('mongoose');
const ApiError = require('../utils/error');

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { user, password, title, content } = req.body;

    if (!user || !password || !title || !content)
      throw new ApiError(400, '데이터 형식이 올바르지 않습니다.');

    const hashed = await bcrypt.hash(password, 12);

    const document = {
      user,
      password: hashed,
      title,
      content,
    };

    await Posts.create(document);

    res.status(201).json({ message: '게시글을 생성하였습니다.' });
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res) => {
  const filter = {};
  const projection = { user: 1, title: 1, createdAt: 1 };
  const options = { sort: { createdAt: -1 } };

  const rawData = await Posts.find(filter, projection, options);

  const result = rawData.map(({ _id, user, title, createdAt }) => {
    return { postId: _id, user, title, createdAt };
  });

  res.status(200).json({ data: result });
});

router.get('/:postId', async (req, res, next) => {
  try {
    const { postId } = req.params;

    if (!isValidObjectId(postId))
      throw new ApiError(400, '데이터 형식이 올바르지 않습니다.');

    const projection = { user: 1, title: 1, content: 1, createdAt: 1 };
    const rawData = await Posts.findById(postId, projection);

    if (!rawData) throw new ApiError(404, '게시글 조회에 실패하였습니다.');

    const { _id, user, title, content, createdAt } = rawData;
    const result = { postId: _id, user, title, content, createdAt };

    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
});

router.put('/:postId', async (req, res, next) => {
  try {
    const { password, title, content } = req.body;
    const { postId } = req.params;

    if (!title || !content || !password || !isValidObjectId(postId))
      throw new ApiError(400, '데이터 형식이 올바르지 않습니다.');

    const projection = { _id: 0, password: 1 };
    const post = await Posts.findById(postId, projection);

    if (!post) throw new ApiError(404, '게시글 조회에 실패하였습니다.');

    const comparisonResult = await bcrypt.compare(password, post.password);

    if (!comparisonResult) throw new ApiError(401, '잘못된 비밀번호입니다.');

    const filter = { _id: postId };
    const update = { title, content };

    await Posts.updateOne(filter, update);

    res.status(200).json({ message: '게시글을 수정하였습니다.' });
  } catch (err) {
    next(err);
  }
});

router.delete('/:postId', async (req, res, next) => {
  try {
    const { password } = req.body;
    const { postId } = req.params;

    if (!password || !isValidObjectId(postId))
      throw new ApiError(400, '데이터 형식이 올바르지 않습니다.');

    const projection = { _id: 0, password: 1 };
    const post = await Posts.findById(postId, projection);

    if (!post) throw new ApiError(404, '게시글 조회에 실패하였습니다.');

    const comparisonResult = await bcrypt.compare(password, post.password);

    if (!comparisonResult) throw new ApiError(401, '잘못된 비밀번호입니다.');

    const filter = { _id: postId };

    await Posts.deleteOne(filter);

    res.status(200).json({ message: '게시글을 삭제하였습니다.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
