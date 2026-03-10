const express = require('express');
const { getAllBookings, createBooking } = require('../controllers/bookingController');
const router = express.Router();

router.get('/', getAllBookings);
router.get('/hotel/:hotelId', (req, res) => {
  const db = require('../db');
  const bookings = db.getBookingsByHotel(req.params.hotelId);
  res.json(bookings);
});
router.post('/', createBooking);

module.exports = router;
