const { Op } = require("sequelize");
const Equipment = require("../models/Equipment");

async function searchEquipment(p) {
  const where = {};

  if (p.q) {
    const like = { [Op.like]: `%${p.q}%` };
    where[Op.or] = [{ name: like }, { description: like }, { category: like }];
  }

  if (p.categories.length) where.category = { [Op.in]: p.categories };
  if (p.statuses.length) where.status = { [Op.in]: p.statuses };

  const { rows, count } = await Equipment.findAndCountAll({
    where,
    order: [[p.sortBy, p.order === 1 ? "ASC" : "DESC"]],
    limit: p.limit,
    offset: (p.page - 1) * p.limit,
  });

  return {
    items: rows,
    pagination: {
      total: count,
      page: p.page,
      limit: p.limit,
      totalPages: Math.ceil(count / p.limit),
      hasNext: p.page * p.limit < count,
      hasPrev: p.page > 1,
    },
  };
}

module.exports = { searchEquipment };