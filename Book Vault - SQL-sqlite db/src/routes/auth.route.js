const authRouter = require("express").Router();

const authController = require("../controllers/auth.controller");

const { rateLimiter } = require("../middlewares/rate-limiter.middleware");
const { validateBody } = require("../middlewares/validate.middleware");
const { signupSchema, loginSchema } = require("../validators/auth.validator");

authRouter.post(
  "/login",
  validateBody(loginSchema),
  rateLimiter,
  authController.login,
);

authRouter.post("/signup", validateBody(signupSchema), authController.signup);

module.exports = authRouter;
