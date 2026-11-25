
const fs = require("fs");
const path = require("path");
const Equipment = require("../models/Equipment");
const { parseSearchParams } = require("../utils/queryParser");
const { searchEquipment } = require("../services/equipmentQuery.service");

const deleteImage = (filename) => {
  if (!filename) return;
  fs.unlink(path.join(__dirname, "..", "uploads", filename), () => {});
};

// Create
exports.create = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const data = { ...req.body };
    if (req.file) data.image = req.file.filename;

    const equipment = await Equipment.create(data);
    res.status(201).json(equipment);
  } catch (err) {
    if (req.file) deleteImage(req.file.filename);
    res.status(400).json({ message: err.message });
  }
};

// Read all
exports.getAll = async (req, res) => {
  try {
    const list = await Equipment.findAll({
      order: [["createdAt", "DESC"]]
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Read one
exports.getOne = async (req, res) => {
  try {
    const equipment = await Equipment.findByPk(req.params.id);

    if (!equipment) {
      return res.status(404).json({ message: "Introuvable" });
    }

    res.json(equipment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update
exports.update = async (req, res) => {
  try {
    const equipment = await Equipment.findByPk(req.params.id);

    if (!equipment) {
      if (req.file) deleteImage(req.file.filename);
      return res.status(404).json({ message: "Introuvable" });
    }

    const data = { ...req.body };

    if (req.file) {
      deleteImage(equipment.image);
      data.image = req.file.filename;
    }

    await equipment.update(data);
    res.json(equipment);
  } catch (err) {
    if (req.file) deleteImage(req.file.filename);
    res.status(400).json({ message: err.message });
  }
};

// Delete
exports.remove = async (req, res) => {
  try {
    const equipment = await Equipment.findByPk(req.params.id);

    if (!equipment) {
      return res.status(404).json({ message: "Introuvable" });
    }

    deleteImage(equipment.image);
    await equipment.destroy();
    res.json({ message: "Supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search + filters
exports.search = async (req, res) => {
  try {
    const params = parseSearchParams(req.query);
    const result = await searchEquipment(params);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get filters
exports.getFilters = async (req, res) => {
  try {
    const categories = await Equipment.findAll({
      attributes: ["category"],
      group: ["category"],
      raw: true
    });

    const statuses = await Equipment.findAll({
      attributes: ["status"],
      group: ["status"],
      raw: true
    });

    res.json({
      categories: categories.map(item => item.category).filter(Boolean),
      statuses: statuses.map(item => item.status).filter(Boolean)
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

