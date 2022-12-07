const { Router } = require('express');
const { signup, login } = require('../controllers/auth.controller');
const { isNotLoggedIn } = require('../middlewares/auth');
const { validateSignup } = require('../middlewares/validator');

const router = Router();

router.post('/signup', isNotLoggedIn, signup);
router.post('/login', isNotLoggedIn, login);

module.exports = router;
