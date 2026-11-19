require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;

// Importation des modules
const cookieParser = require("cookie-parser");
const db = require("./utils/db");

const User = require("./models/user.model");
const Course = require("./models/course.model");
const Reservation = require("./models/reservations");

// Importation des routes
const userRoutes = require("./routers/user.routes");
const courseRoutes = require("./routers/course.routes");
const reservationRoutes = require("./routers/reservationRouteur");

console.log("COURSE ROUTE FILE:", require.resolve("./routers/course.routes"));

// Diagnostic du chargement des routes
console.log("COURSE ROUTES LOADED:", typeof courseRoutes);

// Configuration CORS
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Middleware de diagnostic
app.use((req, res, next) => {
    console.log("REQUEST RECEIVED:", req.method, req.url);
    next();
});

// Route de test
app.get("/", (req, res) => {
    res.send("Labora Backend is working!");
});

// Routes utilisateur
app.use("/api/users", userRoutes);

// Routes des cours
app.use("/api/courses", courseRoutes);

// Routes des réservations
app.use("/api/reservations", reservationRoutes);

console.log("ALL ROUTES REGISTERED");

// Connexion à la base de données et démarrage du serveur
async function testConnection() {
    try {
        await db.authenticate();
        console.log("Database connected successfully");

        await User.sync({ alter: true });
        console.log("User table synchronized successfully");

        await Course.sync();
        console.log("Course table synchronized successfully");

        await Reservation.sync();
        console.log("Reservations table synchronized successfully");

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

    } catch (err) {
        console.log("Database error:", err.message);
    }
}

// Démarrage
testConnection();
