const db = require('../db');

const getAllHotels = async (req, res) => {
  try {
    const rawHotels = db.getHotels();
    const hotels = rawHotels.map(h => {
      const cats = db.getCategoriesByHotel(h.id);
      const startingPrice = cats.length > 0 ? Math.min(...cats.map(c => c.basePrice)) : 0;
      return { ...h, startingPrice };
    });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = db.getHotelById(id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createHotel = async (req, res) => {
  try {
    const newHotel = db.addHotel(req.body);
    res.status(201).json(newHotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllHotels, getHotelById, createHotel };
