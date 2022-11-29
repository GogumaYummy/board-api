const mongoose = require('mongoose');
const logger = require('./logger');
const { dbUser, dbPassword, dbHost, env, dbName } = require('./vars');

const connect = () => {
  const uri = `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`;

  mongoose
    .connect(uri)
    .then(() => {
      logger.info('MongoDB connect success');
    })
    .catch((err) => {
      logger.error(err);
    });
};

if (env === 'development') mongoose.set('debug', true);

mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

module.exports = { connect };
