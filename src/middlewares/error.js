const httpStatus = require('http-status');
const vars = require('../config/vars');
const APIError = require('../utils/error');
const logger = require('../config/logger');

const converter = (err, req, res, next) => {
  if (err instanceof APIError) return next(err);
  const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || httpStatus[statusCode];
  next(new APIError(statusCode, message, err.stack));
};

const handler = (err, req, res, next) => {
  const response = {
    statusCode: err.statusCode,
    message: err.message || httpStatus[err.statusCode],
  };

  if (vars.env === 'development') {
    response.stack = err.stack;

    logger.error(response);
  }

  res.status(err.statusCode).json(response);
};

module.exports = { converter, handler };
