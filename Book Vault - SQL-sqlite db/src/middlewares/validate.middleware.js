const createHttpError = require("http-errors");

const validate = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return next(
      createHttpError(400, "Missing Credentials", {
        code: "MISSING_CREDS",
      }),
    );
  }
  next();
};

module.exports = {
  validate,
};
