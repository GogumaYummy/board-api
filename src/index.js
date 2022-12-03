const app = require('./app');
const logger = require('./config/logger');
const vars = require('./config/vars');
const db = require('./db/models');

db.sequelize
  .sync({ force: false })
  .then(() => {
    logger.info('MySQL connect success');
  })
  .catch((err) => {
    logger.error(err);
  });

app.listen(vars.port, () => logger.info('listening on port ' + vars.port));
