const { Router } = require('express');
const { isNotLoggedIn } = require('../middlewares/auth');

const router = Router();

router.post('/signup', isNotLoggedIn);
router.post('/login', isNotLoggedIn);

module.exports = router;
