const { Router } = require('express');

const { isLoggedIn } = require('../middlewares/auth');
const {
  createComment,
  readComments,
  updateComment,
  deleteComment,
} = require('../controllers/comments.controller');

const router = Router();

router.post('/:postId', isLoggedIn, createComment);
router.get('/:postId', readComments);
router.put('/:commentId', isLoggedIn, updateComment);
router.delete('/:commentId', isLoggedIn, deleteComment);

module.exports = router;
