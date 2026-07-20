// naming tip: Service name = what's actually happening in business terms

const createHttpError = require("http-errors");
const db = require("../db/connection");

const { hashPassword } = require("../utils/hash.util");
const { generateNewId } = require("../utils/id.util");

const authenticateUser = () => {};

const findUserByEmail = (email) => {
  const query = `
  SELECT
    name
  FROM 
    users
  WHERE 
    email = ?
  `;

  const result = db.prepare(query).get(email);
  return result;
};

const findUserById = (id) => {
  const query = `
  SELECT
    *
  FROM 
    users
  WHERE 
    id = ?
  `;

  const result = db.prepare(query).get(id);
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
  const hashedPassword = await hashPassword(userPassword);

  const query = /*sql*/ `
    INSERT INTO
      users
    VALUES(
      ?, ?, ?
    )
    `;

  db.prepare(query).run(id, email, hashedPassword);
  return findUserById(id);
};

module.exports = {
  authenticateUser,
  registerUser,
};
