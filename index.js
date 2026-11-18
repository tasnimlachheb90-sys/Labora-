require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./utils/db");
const Reservation = require("./models/reservations");

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
app.use("/api/reservations", require("./routers/reservationRouteur"));

async function start() {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
    await Reservation.sync();
    console.log("Reservations table is ready.");
    app.listen(port, () => {
      console.log("this server is running on port " + port);
    });
  } catch (err) {
    console.log("error connection database :", err);
  }
}

start();