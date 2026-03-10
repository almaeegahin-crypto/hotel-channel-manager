const db = require('../db');

const getRoomsByHotel = async (req, res) => {
  try {
    res.json(db.getRoomsByHotel(req.params.hotelId));
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const getCategoriesByHotel = async (req, res) => {
  try {
    res.json(db.getCategoriesByHotel(req.params.hotelId));
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const addCategory = async (req, res) => {
  try {
    const cat = db.addCategory(req.body);
    res.status(201).json(cat);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

const updateCategory = async (req, res) => {
  try {
    const cat = db.updateCategory(req.params.id, req.body);
    if (!cat) return res.status(404).json({ message: 'Not found' });
    res.json(cat);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

const deleteCategory = async (req, res) => {
  try {
    res.json(db.deleteCategory(req.params.id));
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const addRoom = async (req, res) => {
  try {
    const room = db.addRoom(req.body);
    res.status(201).json(room);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

const updateRoomStatus = async (req, res) => {
  try {
    const room = db.updateRoomStatus(req.params.id, req.body.status);
    if (!room) return res.status(404).json({ message: 'Not found' });
    res.json(room);
  } catch (e) { res.status(400).json({ error: e.message }); }
};

const deleteRoom = async (req, res) => {
  try {
    res.json(db.deleteRoom(req.params.id));
  } catch (e) { res.status(500).json({ error: e.message }); }
};

module.exports = { getRoomsByHotel, getCategoriesByHotel, addCategory, updateCategory, deleteCategory, addRoom, updateRoomStatus, deleteRoom };
