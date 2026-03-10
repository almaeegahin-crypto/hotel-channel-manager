const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'gate2hotels_secret_2026';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    let user = await prisma.user.findUnique({ where: { email } });

    // Auto-seed admin user if login with demo credentials and DB is empty
    if (!user && email === 'admin@gate2hotels.com' && password === 'admin123') {
      user = await prisma.user.create({
        data: {
          id: 'u_admin',
          name: 'Admin User',
          email: 'admin@gate2hotels.com',
          password: 'admin123',
          role: 'admin'
        }
      });
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

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const newUser = await prisma.user.create({
      data: {
        id: `u_${Date.now()}`,
        name,
        email,
        password,
        role: 'admin',
        hotelId: hotelId || null
      }
    });

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
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) return res.status(404).json({ message: 'User not found' });
    const { password: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (e) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { login, register, getMe };
