const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'gate2hotels_secret_2026';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const data = db.read();
    let user = data.users?.find(u => u.email === email);
    
    // Auto-seed admin user if login with demo credentials
    if (!user && email === 'admin@gate2hotels.com' && password === 'admin123') {
      user = { id: 'u_admin', name: 'Admin User', email: 'admin@gate2hotels.com', password: 'admin123', role: 'admin', hotelId: null };
      if (!data.users) data.users = [];
      data.users.push(user);
      const fs = require('fs');
      const path = require('path');
      fs.writeFileSync(path.join(__dirname, '../data/db.json'), JSON.stringify(data, null, 2));
    }

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Simple password check (plain text for demo — in prod use bcrypt)
    if (user.password !== password) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, hotelId: user.hotelId }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, hotelId } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });

    const data = db.read();
    if (!data.users) data.users = [];
    if (data.users.find(u => u.email === email)) return res.status(409).json({ message: 'Email already registered' });

    const newUser = { id: `u_${Date.now()}`, name, email, password, role: 'admin', hotelId: hotelId || null, createdAt: new Date().toISOString() };
    data.users.push(newUser);
    const fs = require('fs');
    const path = require('path');
    fs.writeFileSync(path.join(__dirname, '../data/db.json'), JSON.stringify(data, null, 2));

    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...safeUser } = newUser;
    res.status(201).json({ token, user: safeUser });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const getMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const data = db.read();
    const user = data.users?.find(u => u.id === decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { password: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (e) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { login, register, getMe };
