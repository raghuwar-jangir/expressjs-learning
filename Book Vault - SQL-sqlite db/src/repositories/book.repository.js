const db = require("../db/connection");

const findAll = () => {
  const query = /*sql*/ `
    SELECT 
        *
    FROM
        books;
    `;

  return db.prepare(query).all();
};

const findByTitle = (text) => {
  const query = /*sql*/ `
        SELECT 
            *
        FROM
            books
        WHERE
            title LIKE "%?%";
    `;

  return db.prepare(query).all(text);
};

module.exports = {
  findAll,
  findByTitle,
};
