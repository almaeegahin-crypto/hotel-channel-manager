const express = require('express');
const { getInventoryByHotel, updateDailyInventory } = require('../controllers/inventoryController');
const router = express.Router();

// No auth required for read, auth can be added later
router.get('/hotel/:hotelId', getInventoryByHotel);
router.post('/update', updateDailyInventory);

module.exports = router;
