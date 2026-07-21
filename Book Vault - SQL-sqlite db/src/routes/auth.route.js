const authRouter = require("express").Router();

const authController = require("../controllers/auth.controller");
const {
  validateRegistration,
} = require("../middlewares/validate-registration.middleware");

authRouter.post("/login", validateRegistration, authController.login);

authRouter.post("/signup", validateRegistration, authController.signup);

module.exports = {
  authRouter,
};
