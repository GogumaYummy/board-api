const { Router } = require('express');

const { isLoggedIn } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  createCommentSchema,
  readCommentsSchema,
  updateCommentSchema,
  deleteCommentSchema,
} = require('../validations/comments.validation');
const {
  createComment,
  readComments,
  updateComment,
  deleteComment,
} = require('../controllers/comments.controller');

const router = Router();

router
  .route('/:postId')
  .post(isLoggedIn, validate(createCommentSchema), createComment)
  .get(validate(readCommentsSchema), readComments);

router
  .route('/:commentId')
  .put(isLoggedIn, validate(updateCommentSchema), updateComment)
  .delete(isLoggedIn, validate(deleteCommentSchema), deleteComment);

module.exports = router;
