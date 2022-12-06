const httpStatus = require('http-status');
const vars = require('../config/vars');
const ApiError = require('../utils/error');
const logger = require('../config/logger');

const converter = (err, req, res, next) => {
  if (err instanceof ApiError) return next(err);
  const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || httpStatus[statusCode];
  next(new ApiError(statusCode, message, err.stack));
};

const handler = (err, req, res, next) => {
  const response = {
    errorMessage: err.message || httpStatus[err.statusCode],
  };

  if (vars.env === 'development') {
    response.stack = err.stack;
    logger.log({ level: 'error', ...response });
  }

  res.status(err.statusCode).json(response);
};

module.exports = { converter, handler };
