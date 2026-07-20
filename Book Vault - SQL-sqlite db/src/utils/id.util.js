const crypto = require("crypto");

const generateNewId = () => {
  return crypto.randomUUID();
};

module.exports = { generateNewId };
