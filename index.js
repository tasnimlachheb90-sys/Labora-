require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { testConnection } = require("./utils/db");
const equipmentRoutes = require("./routes/equipement.routes");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:4200" }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/equipment", equipmentRoutes);

testConnection();

app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
