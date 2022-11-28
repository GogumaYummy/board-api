const app = require('./app');
const logger = require('./config/logger');
const vars = require('./config/vars');

app.listen(vars.port, () => logger.info('listening on port ' + vars.port));
