const db = require('../db');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/db.json');

const getChannelConfigs = async (req, res) => {
  try {
    res.json(db.getChannelsByHotel(req.params.hotelId));
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const syncAllChannels = async (req, res) => {
  try {
    const { hotelId } = req.body;
    const data = db.read();
    const channels = data.channels.filter(c => c.hotelId === hotelId);

    // Update lastSync for all channels
    channels.forEach(ch => {
      const idx = data.channels.findIndex(c => c.id === ch.id);
      if (idx !== -1) data.channels[idx].lastSync = new Date().toISOString();
    });
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

    const results = channels.map(ch => ({
      channel: ch.channelName,
      status: ch.isActive ? 'Success' : 'Auth Error',
      synced: ch.isActive ? ch.bookings : 0,
      timestamp: new Date().toISOString()
    }));

    res.json({ message: 'Sync completed', results });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const toggleChannel = async (req, res) => {
  try {
    const data = db.read();
    const idx = data.channels.findIndex(c => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Channel not found' });
    data.channels[idx].isActive = !data.channels[idx].isActive;
    data.channels[idx].lastSync = new Date().toISOString();
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    res.json(data.channels[idx]);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

module.exports = { getChannelConfigs, syncAllChannels, toggleChannel };
