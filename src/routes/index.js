const { Router } = require('express');
const rateLimiter = require('../middlewares/rateLimiter.js');
const postsRouter = require('./posts.route.js');
const commentsRouter = require('./comments.route.js');
const authRouter = require('./auth.route.js');

const router = Router();

router.get('/', rateLimiter, (req, res) => res.send('OK'));
router.use('/posts', rateLimiter, postsRouter);
router.use('/comments', rateLimiter, commentsRouter);
router.use('/', rateLimiter, authRouter);

module.exports = router;
