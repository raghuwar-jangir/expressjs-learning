const db = require("../db/connection");

const findByEmail = (email) => {
  const query = /*sql*/ `
    SELECT
      *
    FROM 
      users
    WHERE 
      email = ?
    `;

  return db.prepare(query).get(email);
};

const findById = (id) => {
  const query = /*sql*/ `
    SELECT
      *
    FROM 
      users
    WHERE 
      id = ?
    `;

  return db.prepare(query).get(id);
};

const insert = (id, email, password_hash) => {
  const query = /*sql*/ `
    INSERT INTO
      users (
        id, email, password_hash
      )
    VALUES(
      ?, ?, ?
    )
    `;
  db.prepare(query).run(id, userEmail, password_hash);
};

module.exports = {
  findByEmail,
  findById,
  insert,
};
