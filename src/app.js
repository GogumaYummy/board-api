const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const logger = require('./config/logger');
const { env } = require('./config/vars');
const error = require('./middlewares/error');
const api = require('./routes');

const app = express();

app.use(
  morgan(env === 'production' ? 'combined' : 'dev', { stream: logger.stream })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(cors());

app.use('/', api);

app.use(error.converter);
app.use(error.handler);

module.exports = app;
