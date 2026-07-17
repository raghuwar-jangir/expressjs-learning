const Database = require("better-sqlite3");

const db = Database("db/MyDB.db");

const readQuery = /* sql */ `
  SELECT * FROM friends;
  `;

const query = process.argv[2];

try {
  if (query) {
    db.prepare(query).run();
    console.log("✅ QUERY Successfull ✅");
  } else {
    const result = db.prepare(readQuery).all();
    console.log("🚀 ------------------------------------🚀");
    console.log();
    console.log(result);
    console.log();
    console.log("🚀 ------------------------------------🚀");
  }
} catch (error) {
  console.error("❌ Error", error);
}

db.close();
