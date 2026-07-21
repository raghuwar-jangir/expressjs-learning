// naming tip: Service name = what's actually happening in business terms

const createHttpError = require("http-errors");

const { comparePassword, hashThePassword } = require("../utils/hash.util");
const { generateNewId } = require("../utils/id.util");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwt.utils.js");

const userRepository = require("../repositories/user.repository.js");

const findUserByEmail = (email) => {
  const result = userRepository.findByEmail(email);
  return result;
};

const findUserById = (id) => {
  const result = userRepository.findById(id);
  return result;
};

const registerUser = async (userEmail, userPassword) => {
  const userExist = findUserByEmail(userEmail);
  if (userExist) {
    throw createHttpError(409, "User with this email already exist", {
      code: "USER_EXISTS",
    });
  }
  const id = generateNewId();
  const hashedPassword = await hashThePassword(userPassword);

  userRepository.insert(id, email, hashedPassword);
  const user = findUserById(id);
  return {
    id: user.id,
    email: user.email,
    created_at: user.created_at,
  };
};

const authenticateUser = async (userEmail, userPassword) => {
  const user = findUserByEmail(userEmail);
  if (!user) {
    throw createHttpError(401, "Invalid email or password", {
      code: "INVALID_CREDENTIALS",
    });
  }

  const isPasswordMatching = await comparePassword(
    user.password_hash,
    userPassword,
  );
  if (!isPasswordMatching) {
    throw createHttpError(401, "Invalid email or password", {
      code: "INVALID_CREDENTIALS",
    });
  }

  const payload = {
    sub: user.id,
    email: user.email,
  };

  const accessToken = await generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(payload);

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};

module.exports = {
  authenticateUser,
  registerUser,
  findUserById,
};
