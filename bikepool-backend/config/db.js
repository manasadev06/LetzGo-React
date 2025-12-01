// config/db.js
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",       // ⬅️ change if your MySQL user is different
  password: "root",       // ⬅️ put your MySQL password here
  database: "bikepool"   // ⬅️ your DB name
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Database connected");
  }
});

module.exports = db;
