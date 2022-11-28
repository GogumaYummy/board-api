const { Router } = require('express');

const router = Router();

router.get('/status', (req, res) => res.send('OK'));

module.exports = router;
