
const { DataTypes } = require("sequelize");
const db = require("../utils/db");

const Equipment = db.define("Equipment", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  category: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM("available", "reserved", "maintenance"),
    defaultValue: "available",
  },
});

module.exports = Equipment;
