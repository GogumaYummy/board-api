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

const router = Router();

router.put('/:postId/like', isLoggedIn, likePost);
router.get('/like', isLoggedIn, readLikedPosts);

router.post('/', isLoggedIn, createPost);
router.get('/', readPosts);
router.get('/:postId', readPost);
router.put('/:postId', isLoggedIn, updatePost);
router.delete('/:postId', isLoggedIn, deletePost);

module.exports = router;
