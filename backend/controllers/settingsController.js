const db = require('../db');

const getSettings = async (req, res) => {
  try {
    const hotel = db.getHotelById(req.params.hotelId);
    if (!hotel) return res.status(404).json({ message: 'Not found' });
    res.json({
      name: hotel.name,
      language: hotel.language || 'English',
      currency: hotel.currency || 'IQD - Iraqi Dinar',
      taxRate: hotel.taxRate || '15',
      regions: hotel.regions || []
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const updateSettings = async (req, res) => {
  try {
    const updated = db.updateHotelSettings(req.params.hotelId, req.body);
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

module.exports = { getSettings, updateSettings };
