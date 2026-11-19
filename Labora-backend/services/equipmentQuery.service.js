const { Op } = require("sequelize");
const Equipment = require("../models/Equipment");
const Reservation = require("../models/Reservation");

async function searchEquipment(p) {
  const where = {};

  if (p.q) {
    const like = { [Op.like]: `%${p.q}%` };
    where[Op.or] = [
      { name: like },
      { description: like },
      { category: like },
      { location: like },
      { serialNumber: like },
    ];
  }

  if (p.categories.length) where.category = { [Op.in]: p.categories };
  if (p.statuses.length) where.status = { [Op.in]: p.statuses };
  if (p.locations.length) where.location = { [Op.in]: p.locations };

  if (p.availableFrom && p.availableTo) {
    const busy = await Reservation.findAll({
      attributes: ["equipmentId"],
      where: {
        status: { [Op.in]: ["pending", "approved"] },
        startDate: { [Op.lt]: p.availableTo },
        endDate: { [Op.gt]: p.availableFrom },
      },
      raw: true,
    });
    const busyIds = busy.map((r) => r.equipmentId);
    if (busyIds.length) where.id = { [Op.notIn]: busyIds };
  }

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
