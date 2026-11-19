
const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controllers");
const verifyToken = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

// Authentication routes
router.post("/register", userController.register);
router.post("/login", userController.login);

// Profile route (authenticated users)
router.get("/profile", verifyToken, (req, res) => {
    res.status(200).json({
        message: "Welcome to your profile",
        user: req.user
    });
});

// User CRUD (Admin only)
router.get("/", verifyToken, authorizeRoles("Admin"), userController.getAllUsers);

router.get("/:id", verifyToken, authorizeRoles("Admin"), userController.getUserById);

router.put("/:id", verifyToken, authorizeRoles("Admin"), userController.updateUser);

router.delete("/:id", verifyToken, authorizeRoles("Admin"), userController.deleteUser);

module.exports = router;
