const dotenv = require('dotenv-safe');
const path = require('path');

dotenv.config({
  path: path.join(__dirname, '../../.env'),
  example: path.join(__dirname, '../../.env.example'),
});

module.exports = {
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT),
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbDatabase: process.env.DB_DATABASE,
  jwtSecret: process.env.JWT_SECRET,
  passwordSalt: parseInt(process.env.PASSWORD_SALT),
};
