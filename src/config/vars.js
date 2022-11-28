const dotenv = require('dotenv-safe');
const path = require('path');

dotenv.config({
  path: path.join(__dirname, '../../.env'),
  example: path.join(__dirname, '../../.env.example'),
});

module.exports = { env: process.env.NODE_ENV, port: process.env.PORT };
