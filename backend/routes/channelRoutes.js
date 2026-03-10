const express = require('express');
const { getChannelConfigs, syncAllChannels, toggleChannel } = require('../controllers/channelController');
const router = express.Router();

router.get('/:hotelId', getChannelConfigs);
router.post('/sync', syncAllChannels);
router.patch('/:id/toggle', toggleChannel);

module.exports = router;
