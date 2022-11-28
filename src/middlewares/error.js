const httpStatus = require('http-status');
const vars = require('../config/vars');

const handler = (err, req, res, next) => {
  const response = {
    statusCode: err.statusCode,
    message: err.message || httpStatus[err.statusCode],
    errors: err.errors,
  };

  if (vars.env === 'development') response.stack = err.stack;

  res.status(err.statusCode).json(response);
};

module.exports = { handler };
