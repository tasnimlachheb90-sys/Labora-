require("dotenv").config();
const { Sequelize } = require("sequelize");


const db = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialect: "mysql",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  logging: false,
});

async function testConnection() {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
  } catch (err) {
    console.log("error connection database :", err.message);
  }
}

module.exports = { db, testConnection };

