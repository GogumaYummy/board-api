const { Router } = require('express');

const posts = require('./posts');
const comments = require('./comments');

const router = Router();

router.get('/', (req, res) => res.send('OK'));
router.use('/posts', posts);
router.use('/comments', comments);

module.exports = router;