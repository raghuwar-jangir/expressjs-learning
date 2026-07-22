const authRouter = require("express").Router();

const authController = require("../controllers/auth.controller");
const { rateLimiter } = require("../middlewares/rate-limiter.middleware");
const { validate } = require("../middlewares/validate.middleware");
const { signupSchema, loginSchema } = require("../validators/auth.validator");

authRouter.post(
  "/login",
  rateLimiter,
  validate(loginSchema),
  authController.login,
);

authRouter.post("/signup", validate(signupSchema), authController.signup);

module.exports = authRouter;
