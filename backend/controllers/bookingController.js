const db = require('../db');

const getAllBookings = async (req, res) => {
  try {
    const { hotelId } = req.query;
    res.json(hotelId ? db.getBookingsByHotel(hotelId) : db.getAllBookings());
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const getBookingsByHotel = async (req, res) => {
  try {
    res.json(db.getBookingsByHotel(req.params.hotelId));
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const createBooking = async (req, res) => {
  try {
    const bk = db.addBooking(req.body);
    res.status(201).json(bk);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

module.exports = { getAllBookings, getBookingsByHotel, createBooking };
