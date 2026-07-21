const Database = require("better-sqlite3");
const path = require("path");

const NODE_ENV = process.env.NODE_ENV;

require("dotenv").config({
  path: path.join(
    __dirname,
    NODE_ENV == "test" ? "../../.env.test" : "../../.env.local",
  ),
});

const dbPath = process.env.DB_PATH;

const db = new Database(path.join(__dirname, dbPath));

module.exports = db;
