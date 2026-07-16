const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("db/MyDB.db");

const query = `
SELEcT *, name,age FROM celebs;
`;

// db.run(query);
db.all(query, (err, data) => {
  console.log("🚀 ------------------------------🚀");
  console.log("🚀 ~ index.js:11 ~ err >>>", err);
  console.log("🚀 ------------------------------🚀");
  console.log("🚀 ~ index.js:11 ~ data >>>", data);
  console.log("🚀 --------------------------------🚀");
});

console.log("QUERY SUCCESSFULY RAN ✅");

db.close();
