const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: '1분에 10번만 요청할 수 있습니다.',
});

module.exports = rateLimiter;
