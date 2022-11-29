const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: '15분에 20번만 요청할 수 있습니다.',
});

module.exports = rateLimiter;
