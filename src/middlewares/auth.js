const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../config/vars');
const ApiError = require('../utils/error');

const isLoggedIn = (req, res, next) => {
  try {
    res.locals.userId = jwt.verify(req.cookies.accessToken, jwtSecret);
    next();
  } catch {
    next(new ApiError(401, '로그인이 필요합니다.'));
  }
};

const isNotLoggedIn = (req, res, next) => {
  try {
    jwt.verify(req.cookies.accessToken, jwtSecret);
    next(new ApiError(401, '이미 로그인이 되어있습니다.'));
  } catch {
    next();
  }
};

module.exports = { isLoggedIn, isNotLoggedIn };
