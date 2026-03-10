const db = require('../db');

const getAllUsers = async (req, res) => {
  try {
    const data = db.read();
    const users = (data.users || []).map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      hotelId: u.hotelId,
      status: 'Active' // Simplification
    }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllUsers };
