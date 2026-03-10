const db = require('../db');

const getInventoryByHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { startDate, endDate } = req.query;

    if (!hotelId) {
      return res.status(400).json({ error: 'hotelId is required' });
    }

    const start = startDate || new Date().toISOString().split('T')[0];
    const end = endDate || new Date(new Date(start).setDate(new Date(start).getDate() + 14)).toISOString().split('T')[0];

    const inventory = db.getInventory(hotelId, start, end);
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateDailyInventory = async (req, res) => {
  try {
    const { categoryId, date, price, available } = req.body;
    const inventory = db.updateInventory(categoryId, date, price, available);
    res.json(inventory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getInventoryByHotel, updateDailyInventory };
