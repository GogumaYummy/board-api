const { Router } = require('express');

const { isLoggedIn } = require('../middlewares/auth');
const { validateBody } = require('../middlewares/validator');
const {
  createComment,
  readComments,
  updateComment,
  deleteComment,
} = require('../controllers/comments.controller');

const router = Router();

router.post('/:postId', isLoggedIn, validateBody('content'), createComment);
router.get('/:postId', readComments);
router.put('/:commentId', isLoggedIn, validateBody('content'), updateComment);
router.delete('/:commentId', isLoggedIn, deleteComment);

module.exports = router;
