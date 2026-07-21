const authRouter = require("express").Router();

const authController = require("../controllers/auth.controller");
const { validate } = require("../middlewares/validate.middleware");

authRouter.post("/login", validate, authController.login);

authRouter.post("/signup", validate, authController.signup);

module.exports = authRouter;
