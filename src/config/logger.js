const { transports, format, createLogger } = require('winston');
const { env } = require('./vars');

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.prettyPrint()),
  transports: [
    new transports.File({
      dirname: 'logs',
      filename: 'error.log',
      level: 'error',
    }),
    new transports.File({
      dirname: 'logs',
      filename: 'combined.log',
    }),
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
