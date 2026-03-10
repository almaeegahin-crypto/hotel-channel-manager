const express = require('express');
const ctrl = require('../controllers/settingsController');
const router = express.Router();

router.get('/:hotelId', ctrl.getSettings);
router.put('/:hotelId', ctrl.updateSettings);

module.exports = router;
