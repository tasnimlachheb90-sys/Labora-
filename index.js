require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { db, testConnection } = require("./utils/db");

require("./models/Equipment");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => res.send("API Labora fonctionne"));
app.use("/api/equipment", require("./routers/equipmentRouter"));

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  await testConnection();
  await db.sync({ alter: true });
});
