const { rateLimit } = require("express-rate-limit");
const createHttpError = require("http-errors");

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 10,
  message: "Too many requests, please try again later.",
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (req, res, next) => {
    return next(
      createHttpError(429, "Too many requests, please try again later.", {
        code: "LIMIT_EXCEEDED",
      }),
    );
  },
});

module.exports = {
  rateLimiter,
};
