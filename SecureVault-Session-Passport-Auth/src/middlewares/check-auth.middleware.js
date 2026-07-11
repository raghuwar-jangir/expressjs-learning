const createHttpError = require("http-errors");

const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  return next(createHttpError(401, "Unauthorized!"));
};

module.exports = {
  checkAuth,
};
