const argon2 = require("argon2");

const hashThePassword = async (plainPassword) => {
  return await argon2.hash(plainPassword);
};

const comparePassword = async (hashedPassword, plainPassword) => {
  return await argon2.verify(hashedPassword, plainPassword);
};

module.exports = {
  hashThePassword,
  comparePassword,
};
