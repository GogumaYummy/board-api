const { Router } = require('express');
const rateLimiter = require('../middlewares/rateLimiter');
const postsRouter = require('./posts');
const commentsRouter = require('./comments');
const authRouter = require('./auth');

const router = Router();

router.get('/', rateLimiter, (req, res) => res.send('OK'));
router.use('/posts', rateLimiter, postsRouter);
router.use('/comments', rateLimiter, commentsRouter);
router.use('/', rateLimiter, authRouter);

module.exports = router;
