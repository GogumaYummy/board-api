const ApiError = require('../utils/apiError');
const { Post, User, sequelize } = require('../db/models');

exports.likePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { userId } = res.locals;

    const post = await Post.findByPk(postId);

    if (!post) throw new ApiError(404, '게시글 존재하지 않습니다.');

    const user = await User.findByPk(userId);

    if (await user.hasLikedPost(post)) {
      user.removeLikedPost(post);

      res.status(200).json({ message: '게시글의 좋아요를 취소하였습니다.' });
    } else {
      user.addLikedPost(post);

      res.status(200).json({ message: '게시글의 좋아요를 등록하였습니다.' });
    }
  } catch (err) {
    if (!(err instanceof ApiError))
      err.message = '게시글 좋아요에 실패하였습니다.';
    next(err);
  }
};

exports.readLikedPosts = async (req, res, next) => {
  try {
    const { userId } = res.locals;

    const user = await User.findByPk(userId);
    const posts = await user.getLikedPost({
      joinTableAttributes: [],
      attributes: [
        'postId',
        'userId',
        [sequelize.col('User.nickname'), 'nickname'],
        'title',
        'createdAt',
        'updatedAt',
        [sequelize.fn('COUNT', sequelize.col('userLiked.userId')), 'likes'],
      ],
      include: [
        { model: User, attributes: [] },
        { model: User, as: 'userLiked', attributes: [] },
      ],
      group: 'postId',
      order: [
        ['likes', 'DESC'],
        ['postId', 'DESC'],
      ],
    });

    res.status(200).json({ data: posts });
  } catch (err) {
    if (!(err instanceof ApiError))
      err.message = '좋아요 게시글 조회에 실패하였습니다.';
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const { userId } = res.locals;

    const user = await User.findByPk(userId);

    if (!user) throw new Error();

    await Post.create({ title, content, userId });

    res.status(201).json({ message: '게시글 작성에 성공하였습니다.' });
  } catch (err) {
    if (!(err instanceof ApiError))
      err.message = '게시글 작성에 실패하였습니다.';
    next(err);
  }
};

exports.readPosts = async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      attributes: [
        'postId',
        'userId',
        [sequelize.col('User.nickname'), 'nickname'],
        'title',
        'createdAt',
        'updatedAt',
        [sequelize.fn('COUNT', sequelize.col('userLiked.userId')), 'likes'],
      ],
      include: [
        { model: User, attributes: [] },
        { model: User, as: 'userLiked', attributes: [] },
      ],
      group: 'postId',
      order: [['postId', 'DESC']],
    });

    res.status(200).json({ data: posts });
  } catch (err) {
    if (!(err instanceof ApiError))
      err.message = '게시글 조회에 실패하였습니다.';
    next(err);
  }
};

exports.readPost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByPk(postId, {
      attributes: [
        'postId',
        'userId',
        [sequelize.col('User.nickname'), 'nickname'],
        'title',
        'content',
        'createdAt',
        'updatedAt',
        [sequelize.fn('COUNT', sequelize.col('userLiked.userId')), 'likes'],
      ],
      include: [
        { model: User, attributes: [] },
        { model: User, as: 'userLiked', attributes: [] },
      ],
      group: 'postId',
    });

    if (!post) throw new Error();

    res.status(200).json({ data: post });
  } catch (err) {
    if (!(err instanceof ApiError))
      err.message = '게시글 조회에 실패하였습니다.';
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const { postId } = req.params;
    const { userId } = res.locals;

    const post = await Post.findByPk(postId);
    const user = await User.findByPk(userId);

    if (!post || !user || post.userId !== user.userId) throw new Error();

    await post.update({ title, content });

    res.status(200).json({ message: '게시글을 수정하였습니다.' });
  } catch (err) {
    if (!(err instanceof ApiError))
      err.message = '게시글 수정에 실패하였습니다.';
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { userId } = res.locals;

    const post = await Post.findByPk(postId);
    const user = await User.findByPk(userId);

    if (!post) throw new ApiError(404, '게시글이 존재하지 않습니다.');
    if (post.userId !== user.userId) throw new Error();

    await post.destroy();

    res.status(200).json({ message: '게시글을 삭제하였습니다.' });
  } catch (err) {
    if (!(err instanceof ApiError))
      err.message = '게시글 작성에 실패하였습니다.';
    next(err);
  }
};
