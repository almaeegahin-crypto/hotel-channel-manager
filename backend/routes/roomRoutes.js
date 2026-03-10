const express = require('express');
const ctrl = require('../controllers/roomController');
const router = express.Router();

router.get('/hotel/:hotelId', ctrl.getRoomsByHotel);
router.get('/categories/:hotelId', ctrl.getCategoriesByHotel);
router.post('/categories', ctrl.addCategory);
router.put('/categories/:id', ctrl.updateCategory);
router.delete('/categories/:id', ctrl.deleteCategory);
router.post('/', ctrl.addRoom);
router.patch('/:id', ctrl.updateRoomStatus);
router.delete('/:id', ctrl.deleteRoom);

module.exports = router;
