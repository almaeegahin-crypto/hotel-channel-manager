const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const authRoutes = require('./routes/authRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const channelRoutes = require('./routes/channelRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const statsRoutes = require('./routes/statsRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/users', userRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('Hotel Channel Manager API (Iraq) is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
