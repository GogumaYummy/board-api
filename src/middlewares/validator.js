const Joi = require('joi');
const ApiError = require('../utils/error');

exports.validateBody = (input) => {
  const inputTypes = input.split(' ');
  const keys = {};

  inputTypes.forEach((inputType) => {
    switch (inputType) {
      case 'title':
        keys.title = Joi.string().min(1).required();
        break;
      case 'content':
        keys.content = Joi.string().min(1).required();
        break;
      default:
        throw new Error('Invalid input type');
    }
  });

  return async (req, res, next) => {
    const schema = Joi.object().keys(keys);
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
};
