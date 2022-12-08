const httpStatus = require('http-status');
const vars = require('../config/vars');
const ApiError = require('../utils/apiError');
const logger = require('../config/logger');

const converter = (err, req, res, next) => {
  if (err instanceof ApiError) next(err);
  else if (err.isJoi)
    next(new ApiError(412, err.details[0].context.label, err.stack));
  else {
    const statusCode = err.statusCode || 400;
    const message = err.message || httpStatus[statusCode];
    next(new ApiError(statusCode, message, err.stack));
  }
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
