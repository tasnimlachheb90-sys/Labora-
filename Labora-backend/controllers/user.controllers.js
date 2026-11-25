
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userController = {

    // ======================================
    // REGISTER (PUBLIC - STUDENT ONLY)
    // ======================================
    register: async (req, res) => {
        try {
            const { firstname, lastname, email, username, password } = req.body;

            if (![firstname, lastname, email, username, password].every(
                value => typeof value === "string" && value.trim() !== ""
            )) {
                return res.status(400).json({
                    message: "All fields are required"
                });
            }

            const cleanEmail = email.trim().toLowerCase();
            const cleanUsername = username.trim();

            const existingUsername = await User.findOne({
                where: { username: cleanUsername }
            });

            if (existingUsername) {
                return res.status(409).json({
                    message: "Username already exists"
                });
            }

            const existingEmail = await User.findOne({
                where: { email: cleanEmail }
            });

            if (existingEmail) {
                return res.status(409).json({
                    message: "Email already exists"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            // Public registration always creates a Student
            const user = await User.create({
                firstname: firstname.trim(),
                lastname: lastname.trim(),
                email: cleanEmail,
                username: cleanUsername,
                password: hashedPassword
            });

            return res.status(201).json({
                message: "User created successfully",
                user: {
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    username: user.username,
                    role: user.role
                }
            });

        } catch (err) {
            console.error("Registration error:", err.message);
            return res.status(500).json({
                message: "Registration error"
            });
        }
    },


    // ======================================
    // LOGIN
    // ======================================
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            if (
                typeof username !== "string" ||
                !username.trim() ||
                typeof password !== "string" ||
                !password
            ) {
                return res.status(400).json({
                    message: "Username and password are required"
                });
            }

            const user = await User.findOne({
                where: {
                    username: username.trim()
                }
            });

            if (!user) {
                return res.status(401).json({
                    message: "Invalid username or password"
                });
            }

            const passwordMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!passwordMatch) {
                return res.status(401).json({
                    message: "Invalid username or password"
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    role: user.role
                },
                process.env.JWT_SECRET_ACCESS,
                {
                    expiresIn: "15m"
                }
            );

            return res.status(200).json({
                message: "Login successful",
                token,
                user: {
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    username: user.username,
                    role: user.role
                }
            });

        } catch (err) {
            console.error("Login error:", err.message);
            return res.status(500).json({
                message: "Login error"
            });
        }
    },


    // ======================================
    // CREATE USER BY ADMIN
    // ======================================
    createUserByAdmin: async (req, res) => {
        try {
            const {
                firstname,
                lastname,
                email,
                username,
                password,
                role
            } = req.body;

            // Check required fields
            if (![firstname, lastname, email, username, password, role].every(
                value => typeof value === "string" && value.trim() !== ""
            )) {
                return res.status(400).json({
                    message: "All fields are required"
                });
            }

            // Validate role
            if (!["Student", "Admin"].includes(role)) {
                return res.status(400).json({
                    message: "Invalid user role"
                });
            }

            const cleanEmail = email.trim().toLowerCase();
            const cleanUsername = username.trim();

            // Check duplicate username
            const existingUsername = await User.findOne({
                where: { username: cleanUsername }
            });

            if (existingUsername) {
                return res.status(409).json({
                    message: "Username already exists"
                });
            }

            // Check duplicate email
            const existingEmail = await User.findOne({
                where: { email: cleanEmail }
            });

            if (existingEmail) {
                return res.status(409).json({
                    message: "Email already exists"
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user with selected role
            const user = await User.create({
                firstname: firstname.trim(),
                lastname: lastname.trim(),
                email: cleanEmail,
                username: cleanUsername,
                password: hashedPassword,
                role: role
            });

            return res.status(201).json({
                message: "User created successfully",
                user: {
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    username: user.username,
                    role: user.role
                }
            });

        } catch (err) {
            console.error("Admin user creation error:", err.message);
            return res.status(500).json({
                message: "Error creating user"
            });
        }
    },


    // ======================================
    // GET ALL USERS (ADMIN)
    // ======================================
    getAllUsers: async (req, res) => {
        try {
            const users = await User.findAll({
                attributes: { exclude: ["password"] }
            });

            return res.status(200).json(users);

        } catch (err) {
            console.error("Get all users error:", err.message);
            return res.status(500).json({
                message: "Error retrieving users"
            });
        }
    },


    // ======================================
    // GET USER BY ID (ADMIN)
    // ======================================
    getUserById: async (req, res) => {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    message: "Invalid user ID"
                });
            }

            const user = await User.findByPk(id, {
                attributes: { exclude: ["password"] }
            });

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            return res.status(200).json(user);

        } catch (err) {
            console.error("Get user error:", err.message);
            return res.status(500).json({
                message: "Error retrieving user"
            });
        }
    },


    // ======================================
    // UPDATE USER (ADMIN)
    // ======================================
    updateUser: async (req, res) => {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    message: "Invalid user ID"
                });
            }

            const {
                firstname,
                lastname,
                email,
                username,
                password
            } = req.body;

            // Prevent role modification through this route
            if ("role" in req.body) {
                return res.status(400).json({
                    message: "Role cannot be changed through this route"
                });
            }

            const user = await User.findByPk(id);

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            // Update username
            if (username !== undefined) {
                if (typeof username !== "string" || !username.trim()) {
                    return res.status(400).json({
                        message: "Invalid username"
                    });
                }

                const cleanUsername = username.trim();

                if (cleanUsername !== user.username) {
                    const existingUser = await User.findOne({
                        where: { username: cleanUsername }
                    });

                    if (existingUser) {
                        return res.status(409).json({
                            message: "Username already exists"
                        });
                    }

                    user.username = cleanUsername;
                }
            }

            // Update firstname
            if (firstname !== undefined) {
                if (typeof firstname !== "string" || !firstname.trim()) {
                    return res.status(400).json({
                        message: "Invalid firstname"
                    });
                }

                user.firstname = firstname.trim();
            }

            // Update lastname
            if (lastname !== undefined) {
                if (typeof lastname !== "string" || !lastname.trim()) {
                    return res.status(400).json({
                        message: "Invalid lastname"
                    });
                }

                user.lastname = lastname.trim();
            }

            // Update email
            if (email !== undefined) {
                if (typeof email !== "string" || !email.trim()) {
                    return res.status(400).json({
                        message: "Invalid email"
                    });
                }

                const cleanEmail = email.trim().toLowerCase();

                if (cleanEmail !== user.email) {
                    const existingEmail = await User.findOne({
                        where: { email: cleanEmail }
                    });

                    if (existingEmail) {
                        return res.status(409).json({
                            message: "Email already exists"
                        });
                    }

                    user.email = cleanEmail;
                }
            }

            // Update password
            if (password !== undefined) {
                if (typeof password !== "string" || !password) {
                    return res.status(400).json({
                        message: "Invalid password"
                    });
                }

                user.password = await bcrypt.hash(password, 10);
            }

            await user.save();

            return res.status(200).json({
                message: "User updated successfully",
                user: {
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    username: user.username,
                    role: user.role
                }
            });

        } catch (err) {
            console.error("Update user error:", err.message);
            return res.status(500).json({
                message: "Error updating user"
            });
        }
    },


    // ======================================
    // DELETE USER (ADMIN)
    // ======================================
    deleteUser: async (req, res) => {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    message: "Invalid user ID"
                });
            }

            const user = await User.findByPk(id);

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            await user.destroy();

            return res.status(200).json({
                message: "User deleted successfully"
            });

        } catch (err) {
            console.error("Delete user error:", err.message);
            return res.status(500).json({
                message: "Error deleting user"
            });
        }
    }

};

module.exports = userController;
