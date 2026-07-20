const argon2 = require("argon2");

const hashPassword = async (plainPassword) => {
  return await hash(plainPassword);
};

const comparePassword = async (plainPassword, hashedPassword) => {
  return await argon2.verify(hashedPassword, plainPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};
