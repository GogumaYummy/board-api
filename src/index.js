const app = require('./app');
const logger = require('./config/logger');
const vars = require('./config/vars');
const db = require('./config/db');

db.connect();

app.listen(vars.port, () => logger.info('listening on port ' + vars.port));
