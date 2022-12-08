module.exports = (schema) => {
  return async (req, res, next) => {
    try {
      const keys = Object.keys(schema);
      for (const key of keys) await schema[key].validateAsync(req[key]);
      next();
    } catch (err) {
      next(err);
    }
  };
};
