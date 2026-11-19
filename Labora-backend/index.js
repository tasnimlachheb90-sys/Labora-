
require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { db, testConnection } = require("./utils/db");

require("./models/Equipment");

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.get("/", (req, res) => res.send("API Labora fonctionne"));
app.use("/api/equipment", require("./routers/equipmentRouter"));

// Start server
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);

  await testConnection();
  await db.sync({ alter: true });
});
