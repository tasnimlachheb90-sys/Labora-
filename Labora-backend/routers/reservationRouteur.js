const express = require('express');
const router = express.Router();
const c = require('../controllers/reservationContolers');

// /mine and /equipment/... must stay above /:id
router.get('/mine', c.getMyReservations);
router.get('/equipment/:equipmentId/booked', c.getBookedRanges);
router.get('/', c.getAllReservations);
router.post('/', c.createReservation);
router.get('/:id', c.getReservation);
router.put('/:id', c.updateReservation);
router.delete('/:id', c.cancelReservation);

module.exports = router;