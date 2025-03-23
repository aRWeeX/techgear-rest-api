const path = require("path");
const Database = require("better-sqlite3");

const dbPath = path.join(__dirname, "../data/database.db");

let db;

function getDb() {
  if (!db) {
    try {
      db = new Database(dbPath, { verbose: console.log });
      db.pragma("foreign_keys = ON");
    } catch (error) {
      console.error("Failed to connect to database", error);
      process.exit(1);
    }
  }

  return db;
}

function closeDb() {
  if (db) {
    console.log("Closing database connection...");
    db.close();
  }
}

module.exports = { getDb, closeDb };
