const { transports, format, createLogger } = require('winston');
const { env } = require('./vars');

const logger = createLogger({
  level: 'info',
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'logs.log' }),
  ],
});

if (env === 'development') {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(
          ({ timestamp, level, message }) =>
            `${timestamp} [${level}] ${
              message instanceof Object ? JSON.stringify(message) : message
            }`
        )
      ),
      level: 'silly',
    })
  );
}

logger.stream = { write: (message) => logger.http(message) };

module.exports = logger;
