const { Router } = require('express');

const { isLoggedIn } = require('../middlewares/auth');
const {
  createPost,
  readPosts,
  readPost,
  updatePost,
  deletePost,
  readLikedPosts,
  likePost,
} = require('../controllers/posts.controller');
const validate = require('../middlewares/validate');
const {
  createPostSchema,
  readPostSchema,
  updatePostSchema,
  deletePostSchema,
  likePostSchema,
} = require('../validations/posts.validation');

const router = Router();

router.put('/:postId/like', isLoggedIn, validate(likePostSchema), likePost);
router.get('/like', isLoggedIn, readLikedPosts);

router
  .route('/')
  .post(isLoggedIn, validate(createPostSchema), createPost)
  .get(readPosts);

router
  .route('/:postId')
  .get(validate(readPostSchema), readPost)
  .put(isLoggedIn, validate(updatePostSchema), updatePost)
  .delete(isLoggedIn, validate(deletePostSchema), deletePost);

module.exports = router;
