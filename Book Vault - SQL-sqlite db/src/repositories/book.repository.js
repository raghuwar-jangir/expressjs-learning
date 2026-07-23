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
  const query = `
        SELECT 
            *
        FROM
            books
        WHERE
            title LIKE ?;
    `;

  return db.prepare(query).all(`%${text}%`);
};

const findById = (id) => {
  const query = /*sql*/ `
        SELECT 
            *
        FROM
            books
        WHERE
            id = ?;
    `;

  return db.prepare(query).get(id);
};

const insert = (id, title, author, price, rating, pages, publish_year) => {
  const query = /*sql*/ `
    INSERT INTO 
        books 
        (id, title, author, price, rating, pages, publish_year)
    VALUES
      (?, ?, ?, ?, ?, ?, ?);
    `;

  db.prepare(query).run(id, title, author, price, rating, pages, publish_year);
};

const deleteById = (id) => {
  const query = /*sql*/ `
    DELETE FROM 
        books
    WHERE   
        id = ?;
    `;

  db.prepare(query).run(id);
};

module.exports = {
  findAll,
  findByTitle,
  insert,
  findById,
  deleteById,
};
