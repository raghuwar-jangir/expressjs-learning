// naming tip: Controller name = what the client/HTTP thinks it's asking for

const authService = require("../services/auth.service");
const { sendResponse } = require("../utils/response.util");

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await authService.authenticateUser(email, password);
    return sendResponse(res, 200, user, "User Successfully logged in");
  } catch (error) {
    return next(error);
  }
};

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await authService.registerUser(email, password);
    return sendResponse(res, 201, user, "User registered successfully");
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  login,
  signup,
};
