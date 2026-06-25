const validateLogBody = (req, res, next) => {
  if (!req.body?.message) {
    const err = new Error("Invalid log");
    err.status = 400;
    return next(err);
  }
  next();
};

module.exports = {
  validateLogBody,
};
