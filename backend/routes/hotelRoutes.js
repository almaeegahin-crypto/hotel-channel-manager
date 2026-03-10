const express = require('express');
const { getAllHotels, getHotelById, createHotel } = require('../controllers/hotelController');
const router = express.Router();

// No auth for read endpoints — frontend fetches hotels freely
router.get('/', getAllHotels);
router.get('/:id', getHotelById);
router.post('/', createHotel);

module.exports = router;
