// THUMB RULE 👍
// One-time script, blocking OK     ==>>>   fs.readFileSync()
// Server context, small file       ==>>>   await fs.promises.readFile()
// Server context, large file       ==>>>   fs.createReadStream()

const Database = require("better-sqlite3");

const fs = require("fs");
const path = require("path");

// const db = new Database("./bookvault.db"); ❌ //file location depends on cwd, from where the init file executed,

// 🧠 Production rule 🧠: //always use path module for path related work
const db = new Database(path.join(__dirname, "../../bookvault.db"));

// 🧠 Production rule 🧠: setup/config scripts should fail loudly.
const data = fs.readFileSync(path.join(__dirname, "./schema.sql"));

const initialQueries = data.toString();

// 🧠 Production rule 🧠:
// .exec() -> run a script (schema setup, migrations) — multiple statements OK, no placeholders
// .run() → CREATE, INSERT, UPDATE, DELETE (any statement that doesn't return rows)
// .all() → SELECT queries expecting multiple rows
// .get() → SELECT expecting one row (e.g. find by id) 🎯
db.exec(initialQueries);

console.log("Tables Created Successfully ✅");

db.close(); //explicitly close db connection
