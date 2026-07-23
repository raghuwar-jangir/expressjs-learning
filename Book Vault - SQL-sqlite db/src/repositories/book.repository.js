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

const update = (id, fields) => {
  const keys = Object.keys(fields);

  const setClause = keys
    .map((key) => {
      return `${key} = ?`;
    })
    .join(", ");

  const values = keys.map((k) => fields[k]);

  const query = /*sql*/ `
    UPDATE 
      books
    SET   
     ${setClause}
    WHERE id = ?;
  `;

  db.prepare(query).run(...values, id);
};

const topRated = () => {
  const query = /*sql*/ `
    SELECT
      *
    FROM 
      books
    WHERE 
      rating >= ?;  
  `;

  const result = db.prepare(query).all(4.5);
  return result;
};

module.exports = {
  findAll,
  findByTitle,
  insert,
  findById,
  deleteById,
  update,
  topRated,
};
