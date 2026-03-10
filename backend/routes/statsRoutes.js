const express = require('express');
const router = express.Router();
const db = require('../db');

// Stats endpoint for dashboard
router.get('/stats/:hotelId', (req, res) => {
  try {
    const stats = db.getStats(req.params.hotelId);
    res.json(stats);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
