const { dbUser, dbPassword, dbHost, env, dbDatabase } = require('./vars');

module.exports = {
  development: {
    username: dbUser,
    password: dbPassword,
    database: dbDatabase,
    host: dbHost,
    dialect: 'mysql',
  },
  test: {
    username: dbUser,
    password: dbPassword,
    database: dbDatabase,
    host: dbHost,
    dialect: 'mysql',
  },
  production: {
    username: dbUser,
    password: dbPassword,
    database: dbDatabase,
    host: dbHost,
    dialect: 'mysql',
  },
};
