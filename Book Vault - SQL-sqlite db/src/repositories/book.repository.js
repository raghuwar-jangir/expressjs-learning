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

// Goal: Find unique authors who published books recently without any star rating yet.
const stat1 = () => {
  const query = /*sql*/ `
    SELECT 
      DISTINCT author
    FROM 
      books
    WHERE 
      rating IS NULL 
      AND publish_year >= 2020
    ORDER BY 
      publish_year DESC
    LIMIT 5;
`;

  return db.prepare(query).all();
};

// Pull the 5 cheapest books that are either short (under 200 pages) or moderately long but highly rated.
const stat2 = () => {
  const query = /*sql*/ `
    SELECT 
      title, 
      author, 
      price,
      rating, 
      pages,
      publish_year
    FROM 
      books
    WHERE 
      pages < 200
      OR ((pages BETWEEN 300 AND 500) AND rating > 4)
    ORDER BY
       price
    LIMIT
      5;
`;

  return db.prepare(query).all();
};

//Tag books dynamically as 'Masterpiece', 'Solid Read', or 'Unrated', while flagging long epics vs. quick reads.
const stat3 = () => {
  const query = /*sql*/ `
    SELECT 
      title, 
      author, 
      rating, 
      price,
      pages,
      publish_year, 
      CASE
        WHEN rating >= 4.5 THEN 'Masterpiece'
        WHEN rating BETWEEN 4 AND 4.5 THEN 'Solid Read'
        WHEN rating IS NULL THEN 'Unrated'
        WHEN pages > 300 THEN 'Long epics'
        WHEN pages < 200 THEN 'Quick reads'
        ELSE '-'
      END AS Review
    FROM 
      books;
  `;

  return db.prepare(query).all();
};

//Filter for books in a specific sweet-spot price range ($10–$25) published between 2010 and 2020, ranked by rating.
const stat4 = () => {
  const query = /*sql*/ `
   SELECT 
      title, 
      author, 
      rating, 
      price,
      pages
      publish_year
   FROM
    books
  WHERE 
    price BETWEEN 400 AND 800
    AND (publish_year BETWEEN 2010 AND 2020)
  ORDER BY
    rating DESC
  LIMIT 5;
  `;

  return db.prepare(query).all();
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
