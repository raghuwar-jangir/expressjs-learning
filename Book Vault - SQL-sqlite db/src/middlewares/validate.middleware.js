// middlewares/validate.middleware.js
const createHttpError = require("http-errors");

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return next(
      createHttpError(400, result.error.issues[0].message, {
        code: "VALIDATION_ERROR",
      }),
    );
  }
  req.body = result.data;
  next();
};

module.exports = { validate };
