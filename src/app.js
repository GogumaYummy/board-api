const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./config/logger');
const { env } = require('./config/vars');
const error = require('./middlewares/error');
const v1 = require('./routes/v1');

const app = express();

app.use(
  morgan(env === 'production' ? 'combined' : 'dev', { stream: logger.stream })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

app.use('/v1', v1);

app.use(error.converter);
app.use(error.handler);

module.exports = app;
