const { Router } = require('express');
const { signup, login } = require('../controllers/auth.controller');
const { isNotLoggedIn } = require('../middlewares/auth.js');
const validate = require('../middlewares/validate');
const { signupSchema, loginSchema } = require('../validations/auth.validation');

const router = Router();
router.post('/signup', isNotLoggedIn, validate(signupSchema), signup);
router.post('/login', isNotLoggedIn, validate(loginSchema), login);

module.exports = router;
