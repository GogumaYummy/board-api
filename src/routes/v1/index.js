const { Router } = require('express');

const article = require('./article');
const board = require('./board');
const comment = require('./comment');

const router = Router();

router.get('/status', (req, res) => res.send('OK'));

router.use('/article', article);
router.use('/board', board);
router.use('/comment', comment);

module.exports = router;
