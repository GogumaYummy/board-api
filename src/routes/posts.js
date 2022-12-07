const { Router } = require('express');

const { isLoggedIn } = require('../middlewares/auth');
const { validateBody } = require('../middlewares/validator');
const {
  createPost,
  readPosts,
  readPost,
  updatePost,
  deletePost,
  readLikedPosts,
  likePost,
} = require('../controllers/posts.controller');

const router = Router();

router.put('/:postId/like', isLoggedIn, likePost);
router.get('/like', isLoggedIn, readLikedPosts);

router.post('/', isLoggedIn, validateBody('title content'), createPost);
router.get('/', readPosts);
router.get('/:postId', readPost);
router.put('/:postId', isLoggedIn, validateBody('title content'), updatePost);
router.delete('/:postId', isLoggedIn, deletePost);

module.exports = router;
