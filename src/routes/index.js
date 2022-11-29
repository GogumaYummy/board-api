const { Router } = require('express');

const posts = require('./posts');
const comments = require('./comments');
const rateLimiter = require('../middlewares/rateLimiter');

const router = Router();

router.get('/', (req, res) => res.send('OK'));
router.use('/posts', rateLimiter, posts);
router.use('/comments', rateLimiter, comments);

module.exports = router;
