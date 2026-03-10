const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Stats endpoint for dashboard
router.get('/stats/:hotelId', async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    if (hotelId === 'null' || !hotelId) {
      // if admin user has no specific hotel, get global stats
      const totalBookings = await prisma.booking.count();
      const totalRevenueObj = await prisma.booking.aggregate({ _sum: { totalAmount: true } });
      const rooms = await prisma.room.count();
      const occupied = await prisma.room.count({ where: { status: { in: ['Occupied', 'Checked In'] } } });
      const occupancy = rooms > 0 ? Math.round((occupied / rooms) * 100) : 0;
      const channels = await prisma.channelConfig.count();
      const activeChannels = await prisma.channelConfig.count({ where: { isActive: true } });

      const recentBookings = await prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
      });

      res.json({
        totalRevenue: totalRevenueObj._sum.totalAmount || 0,
        totalBookings,
        occupancy: `${occupancy}%`,
        channels: `${activeChannels} / ${channels}`,
        hotelName: 'All Hotels (Admin)',
        recentBookings,
        syncStatus: []
      });
      return;
    }

    const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
    const totalBookings = await prisma.booking.count({ where: { hotelId } });
    const totalRevenueObj = await prisma.booking.aggregate({ where: { hotelId }, _sum: { totalAmount: true } });
    const rooms = await prisma.room.count({ where: { hotelId } });
    const occupied = await prisma.room.count({ where: { hotelId, status: { in: ['Occupied', 'Checked In'] } } });
    const occupancy = rooms > 0 ? Math.round((occupied / rooms) * 100) : 0;

    const allChannels = await prisma.channelConfig.findMany({ where: { hotelId } });
    const active = allChannels.filter(c => c.isActive).length;

    const recentBookings = await prisma.booking.findMany({
      where: { hotelId },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    res.json({
      totalRevenue: totalRevenueObj._sum.totalAmount || 0,
      totalBookings,
      occupancy: `${occupancy}%`,
      channels: `${active} / ${allChannels.length}`,
      hotelName: hotel?.name || '',
      recentBookings,
      syncStatus: allChannels.map(c => ({
        name: c.channelName,
        status: c.isActive ? 'Synced' : 'Error',
        time: c.lastSync ? timeSince(c.lastSync) : 'Never'
      }))
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

function timeSince(dateStr) {
  if (!dateStr) return 'Never';
  const secs = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)} mins ago`;
  return `${Math.floor(secs / 3600)}h ago`;
}

module.exports = router;
