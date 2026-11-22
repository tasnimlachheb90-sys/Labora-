const { Op } = require('sequelize');
const Reservation = require('../models/reservations');

// DATEONLY uses 'YYYY-MM-DD' strings, so plain string comparison works
const isValidDay = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !isNaN(new Date(v));
const todayStr = () => new Date().toISOString().slice(0, 10);

// Double-booking check: two inclusive ranges overlap when
// existing.start <= newEnd AND existing.end >= newStart
const findConflict = (equipmentId, start, end, excludeId = null) => {
  const where = {
    equipmentId,
    status: 'active',
    startDate: { [Op.lte]: end },
    endDate: { [Op.gte]: start },
  };
  if (excludeId) where.id = { [Op.ne]: excludeId };
  return Reservation.findOne({ where });
};

// CREATE: POST /api/reservations
// body: { userId, equipmentId, startDate, endDate, purpose }
exports.createReservation = async (req, res) => {
  try {
    const { userId, equipmentId, startDate, endDate, purpose } = req.body;

    if (!userId || !equipmentId || !isValidDay(startDate) || !isValidDay(endDate))
      return res.status(400).json({ message: 'userId, equipmentId, startDate and endDate (YYYY-MM-DD) are required' });
    if (endDate < startDate)
      return res.status(400).json({ message: 'End date must be on or after start date' });
    if (startDate < todayStr())
      return res.status(400).json({ message: 'Start date cannot be in the past' });

    const conflict = await findConflict(equipmentId, startDate, endDate);
    if (conflict)
      return res.status(409).json({
        message: 'This equipment is already booked for part of those dates',
        conflict: { startDate: conflict.startDate, endDate: conflict.endDate },
      });

    const reservation = await Reservation.create({ userId, equipmentId, startDate, endDate, purpose });
    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ (a user's reservations): GET /api/reservations/mine?userId=1&status=active
exports.getMyReservations = async (req, res) => {
  try {
    if (!req.query.userId) return res.status(400).json({ message: 'userId query parameter is required' });
    const where = { userId: req.query.userId };
    if (req.query.status) where.status = req.query.status;
    res.json(await Reservation.findAll({ where, order: [['startDate', 'ASC']] }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ (all): GET /api/reservations
exports.getAllReservations = async (req, res) => {
  try {
    res.json(await Reservation.findAll({ order: [['startDate', 'DESC']] }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ (booked ranges for one item): GET /api/reservations/equipment/:equipmentId/booked
exports.getBookedRanges = async (req, res) => {
  try {
    res.json(
      await Reservation.findAll({
        where: { equipmentId: req.params.equipmentId, status: 'active', endDate: { [Op.gte]: todayStr() } },
        attributes: ['startDate', 'endDate'],
        order: [['startDate', 'ASC']],
      })
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ (one): GET /api/reservations/:id
exports.getReservation = async (req, res) => {
  try {
    const r = await Reservation.findByPk(req.params.id);
    if (!r) return res.status(404).json({ message: 'Reservation not found' });
    res.json(r);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE: PUT /api/reservations/:id
exports.updateReservation = async (req, res) => {
  try {
    const r = await Reservation.findByPk(req.params.id);
    if (!r) return res.status(404).json({ message: 'Reservation not found' });
    if (r.status !== 'active')
      return res.status(400).json({ message: 'Only active reservations can be changed' });

    const startDate = req.body.startDate ?? r.startDate;
    const endDate = req.body.endDate ?? r.endDate;
    if (!isValidDay(startDate) || !isValidDay(endDate) || endDate < startDate)
      return res.status(400).json({ message: 'Invalid date range' });

    if (await findConflict(r.equipmentId, startDate, endDate, r.id))
      return res.status(409).json({ message: 'Those dates overlap another booking' });

    r.startDate = startDate;
    r.endDate = endDate;
    if (req.body.purpose !== undefined) r.purpose = req.body.purpose;
    await r.save();
    res.json(r);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE (cancel): DELETE /api/reservations/:id
exports.cancelReservation = async (req, res) => {
  try {
    const r = await Reservation.findByPk(req.params.id);
    if (!r) return res.status(404).json({ message: 'Reservation not found' });
    r.status = 'cancelled';
    await r.save();
    res.json({ message: 'Reservation cancelled', id: r.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};