
const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controllers");
const verifyToken = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

// ======================================
// AUTHENTICATION ROUTES
// ======================================

// Public registration (Student only)
router.post("/register", userController.register);

// Public login
router.post("/login", userController.login);


// ======================================
// PROFILE ROUTE
// ======================================

// Authenticated users
router.get("/profile", verifyToken, (req, res) => {
    res.status(200).json({
        message: "Welcome to your profile",
        user: req.user
    });
});


// ======================================
// USER MANAGEMENT (ADMIN ONLY)
// ======================================

// Create a user (Student or Admin)
router.post(
    "/",
    verifyToken,
    authorizeRoles("Admin"),
    userController.createUserByAdmin
);

// Get all users
router.get(
    "/",
    verifyToken,
    authorizeRoles("Admin"),
    userController.getAllUsers
);

// Get user by ID
router.get(
    "/:id",
    verifyToken,
    authorizeRoles("Admin"),
    userController.getUserById
);

// Update user
router.put(
    "/:id",
    verifyToken,
    authorizeRoles("Admin"),
    userController.updateUser
);

// Delete user
router.delete(
    "/:id",
    verifyToken,
    authorizeRoles("Admin"),
    userController.deleteUser
);

module.exports = router;
