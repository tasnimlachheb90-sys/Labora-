
const { DataTypes } = require("sequelize");
const db = require("../utils/db");

const User = db.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
},
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM("Student", "Admin"),
        allowNull: false,
        defaultValue: "Student"
    }
});

module.exports = User;
