require("dotenv").config();
const mysql = require("mysql2/promise");

try {
  const db = mysql.createPool({
    database: process.env.DATABASE,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
  
  console.log("MySQL database connected successfully");

  module.exports = db;
} catch (error) {
  console.log(error);
}
