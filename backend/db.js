const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'db.json');

if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

const today = new Date();
today.setHours(0, 0, 0, 0);

const fmt = (d) => d.toISOString().split('T')[0];
const makeDate = (offset) => { const d = new Date(today); d.setDate(today.getDate() + offset); return fmt(d); };
const uid = () => `id_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const timeSince = (dateStr) => {
  const secs = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)} mins ago`;
  return `${Math.floor(secs / 3600)}h ago`;
};

const INITIAL = {
  hotels: [
    { id: "h1", name: "Erbil Grand Heritage",  address: "Bakhtiari St",  city: "Erbil",   contact: "+964 750 000 1111", email: "info@erbilgrand.com",           currency: "IQD - Iraqi Dinar", totalRooms: 45, language: "English", taxRate: "15", regions: ["Iraq", "Kurdistan Region"]  },
    { id: "h2", name: "Baghdad Palace Hotel",   address: "Abu Nuwas St",  city: "Baghdad", contact: "+964 780 000 2222", email: "stay@baghdadpalace.com",        currency: "IQD - Iraqi Dinar", totalRooms: 120, language: "Arabic", taxRate: "15", regions: ["Iraq", "GCC"] },
    { id: "h3", name: "Basra International",    address: "Corniche St",   city: "Basra",   contact: "+964 770 000 3333", email: "reservations@basraint.com",     currency: "IQD - Iraqi Dinar", totalRooms: 58, language: "English", taxRate: "10", regions: ["Iraq", "GCC"]  }
  ],
  roomCategories: [
    { id: "c1", hotelId: "h1", name: "Single Room",     basePrice: 150000, capacity: 1, totalRooms: 12 },
    { id: "c2", hotelId: "h1", name: "Double Room",     basePrice: 250000, capacity: 2, totalRooms: 20 },
    { id: "c3", hotelId: "h1", name: "Executive Suite", basePrice: 450000, capacity: 3, totalRooms: 8  },
    { id: "c4", hotelId: "h2", name: "Standard Room",   basePrice: 180000, capacity: 2, totalRooms: 60 },
    { id: "c5", hotelId: "h2", name: "Deluxe Room",     basePrice: 320000, capacity: 2, totalRooms: 40 },
    { id: "c6", hotelId: "h2", name: "Presidential",    basePrice: 850000, capacity: 4, totalRooms: 10 },
    { id: "c7", hotelId: "h3", name: "Sea View Room",   basePrice: 220000, capacity: 2, totalRooms: 30 },
    { id: "c8", hotelId: "h3", name: "Luxury Suite",    basePrice: 450000, capacity: 2, totalRooms: 15 }
  ],
  rooms: [
    { id: "r1",  hotelId: "h1", categoryId: "c1", number: "101", status: "Available"   },
    { id: "r2",  hotelId: "h1", categoryId: "c1", number: "102", status: "Occupied"    },
    { id: "r3",  hotelId: "h1", categoryId: "c1", number: "103", status: "Available"   },
    { id: "r4",  hotelId: "h1", categoryId: "c2", number: "201", status: "Available"   },
    { id: "r5",  hotelId: "h1", categoryId: "c2", number: "202", status: "Cleaning"    },
    { id: "r6",  hotelId: "h1", categoryId: "c3", number: "301", status: "Maintenance" },
    { id: "r7",  hotelId: "h2", categoryId: "c4", number: "101", status: "Available"   },
    { id: "r8",  hotelId: "h2", categoryId: "c4", number: "102", status: "Occupied"    },
    { id: "r9",  hotelId: "h2", categoryId: "c5", number: "201", status: "Available"   },
    { id: "r10", hotelId: "h2", categoryId: "c6", number: "P01", status: "Available"   },
    { id: "r11", hotelId: "h3", categoryId: "c7", number: "101", status: "Occupied"    },
    { id: "r12", hotelId: "h3", categoryId: "c8", number: "S01", status: "Available"   }
  ],
  bookings: [
    { id: "BK-4592", hotelId: "h1", guestName: "Mohammed Jamil", checkIn: makeDate(3),  checkOut: makeDate(5),  status: "Confirmed",   source: "Booking.com", totalAmount: 500000,  roomNumber: "101" },
    { id: "BK-4593", hotelId: "h1", guestName: "Sara Ahmed",     checkIn: makeDate(5),  checkOut: makeDate(9),  status: "Pending",     source: "Direct",      totalAmount: 1250000, roomNumber: "201" },
    { id: "BK-4594", hotelId: "h1", guestName: "Ali Basheer",    checkIn: makeDate(-2), checkOut: makeDate(1),  status: "Checked In",  source: "Expedia",     totalAmount: 300000,  roomNumber: "102" },
    { id: "BK-4595", hotelId: "h2", guestName: "Zaid Hussein",   checkIn: makeDate(1),  checkOut: makeDate(4),  status: "Confirmed",   source: "Agoda",       totalAmount: 675000,  roomNumber: "101" },
    { id: "BK-4596", hotelId: "h2", guestName: "Noor Khalid",    checkIn: makeDate(7),  checkOut: makeDate(10), status: "Confirmed",   source: "Booking.com", totalAmount: 960000,  roomNumber: "201" },
    { id: "BK-4597", hotelId: "h3", guestName: "Dania Hakim",    checkIn: makeDate(-1), checkOut: makeDate(2),  status: "Checked In",  source: "Direct",      totalAmount: 660000,  roomNumber: "101" },
    { id: "BK-4598", hotelId: "h1", guestName: "Khalil Rashid",  checkIn: makeDate(-5), checkOut: makeDate(-3), status: "Completed",   source: "Expedia",     totalAmount: 500000,  roomNumber: "103" },
    { id: "BK-4599", hotelId: "h2", guestName: "Wasim Al-Farsi", checkIn: makeDate(14), checkOut: makeDate(17), status: "Pending",     source: "Direct",      totalAmount: 850000,  roomNumber: "P01" }
  ],
  channels: [
    { id: "ch1", hotelId: "h1", channelName: "Booking.com", isActive: true,  bookings: 142, commission: "15%", lastSync: new Date(Date.now() - 2*60000).toISOString()  },
    { id: "ch2", hotelId: "h1", channelName: "Expedia",     isActive: true,  bookings: 84,  commission: "18%", lastSync: new Date(Date.now() - 15*60000).toISOString() },
    { id: "ch3", hotelId: "h1", channelName: "Agoda",       isActive: false, bookings: 32,  commission: "12%", lastSync: new Date(Date.now() - 60*60000).toISOString() },
    { id: "ch4", hotelId: "h1", channelName: "Airbnb",      isActive: true,  bookings: 21,  commission: "3%",  lastSync: new Date(Date.now() - 45*60000).toISOString() },
    { id: "ch5", hotelId: "h2", channelName: "Booking.com", isActive: true,  bookings: 210, commission: "15%", lastSync: new Date(Date.now() - 5*60000).toISOString()  },
    { id: "ch6", hotelId: "h2", channelName: "Expedia",     isActive: true,  bookings: 98,  commission: "18%", lastSync: new Date(Date.now() - 20*60000).toISOString() },
    { id: "ch7", hotelId: "h3", channelName: "Booking.com", isActive: true,  bookings: 76,  commission: "15%", lastSync: new Date(Date.now() - 8*60000).toISOString()  }
  ],
  dailyInventory: []
};

// seed 14 days of inventory
function seedInventory(cats) {
  const inv = [];
  cats.forEach(cat => {
    for (let i = 0; i < 14; i++) {
      const date = makeDate(i);
      inv.push({
        id: `inv-${cat.id}-${date}`,
        categoryId: cat.id, date,
        price: Math.round(cat.basePrice * (1 + (Math.random() > 0.7 ? 0.15 : 0))),
        available: Math.floor(Math.random() * Math.max(cat.totalRooms * 0.6, 3)) + 2
      });
    }
  });
  return inv;
}

if (!fs.existsSync(DB_PATH)) {
  INITIAL.dailyInventory = seedInventory(INITIAL.roomCategories);
  fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL, null, 2));
}

const read  = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
const write = (d) => fs.writeFileSync(DB_PATH, JSON.stringify(d, null, 2));

module.exports = {
  read,

  /* ── Hotels ── */
  getHotels: () => read().hotels,
  getHotelById: (id) => {
    const d = read();
    const h = d.hotels.find(h => h.id === id);
    if (!h) return null;
    return { ...h, categories: d.roomCategories.filter(c => c.hotelId === id), channels: d.channels.filter(c => c.hotelId === id) };
  },
  updateHotelSettings: (id, updates) => {
    const d = read();
    const idx = d.hotels.findIndex(h => h.id === id);
    if (idx === -1) return null;
    d.hotels[idx] = { ...d.hotels[idx], ...updates };
    write(d);
    return d.hotels[idx];
  },
  addHotel: (hotel) => {
    const d = read();
    const newHotel = { id: uid(), ...hotel, totalRooms: 0, currency: 'IQD - Iraqi Dinar', language: 'English', taxRate: '10', regions: ['Iraq'] };
    d.hotels.push(newHotel);
    write(d);
    return newHotel;
  },

  /* ── Room Categories ── */
  getCategoriesByHotel: (hotelId) => read().roomCategories.filter(c => c.hotelId === hotelId),
  addCategory: (cat) => {
    const d = read();
    const newCat = { id: uid(), ...cat };
    d.roomCategories.push(newCat);
    // seed 14 days inventory for the new category
    const today = new Date(); today.setHours(0,0,0,0);
    for (let i = 0; i < 14; i++) {
      const date = makeDate(i);
      d.dailyInventory.push({ id: `inv-${newCat.id}-${date}`, categoryId: newCat.id, date, price: newCat.basePrice, available: newCat.totalRooms });
    }
    write(d);
    return newCat;
  },
  updateCategory: (id, updates) => {
    const d = read();
    const idx = d.roomCategories.findIndex(c => c.id === id);
    if (idx === -1) return null;
    d.roomCategories[idx] = { ...d.roomCategories[idx], ...updates };
    write(d);
    return d.roomCategories[idx];
  },
  deleteCategory: (id) => {
    const d = read();
    d.roomCategories = d.roomCategories.filter(c => c.id !== id);
    d.dailyInventory = d.dailyInventory.filter(i => i.categoryId !== id);
    write(d);
    return { success: true };
  },

  /* ── Rooms ── */
  getRoomsByHotel: (hotelId) => {
    const d = read();
    return d.rooms.filter(r => r.hotelId === hotelId).map(r => ({
      ...r, category: d.roomCategories.find(c => c.id === r.categoryId)?.name || ''
    }));
  },
  addRoom: (room) => {
    const d = read();
    const newRoom = { id: uid(), ...room };
    d.rooms.push(newRoom);
    write(d);
    return newRoom;
  },
  updateRoomStatus: (id, status) => {
    const d = read();
    const idx = d.rooms.findIndex(r => r.id === id);
    if (idx === -1) return null;
    d.rooms[idx].status = status;
    write(d);
    return d.rooms[idx];
  },
  deleteRoom: (id) => {
    const d = read();
    d.rooms = d.rooms.filter(r => r.id !== id);
    write(d);
    return { success: true };
  },

  /* ── Inventory ── */
  getInventory: (hotelId, start, end) => {
    const d = read();
    return d.roomCategories.filter(c => c.hotelId === hotelId).map(cat => ({
      ...cat,
      inventory: d.dailyInventory
        .filter(inv => inv.categoryId === cat.id && inv.date >= start && inv.date <= end)
        .sort((a, b) => a.date.localeCompare(b.date))
    }));
  },
  updateInventory: (categoryId, date, price, available) => {
    const d = read();
    const idx = d.dailyInventory.findIndex(inv => inv.categoryId === categoryId && inv.date === date);
    if (idx !== -1) {
      if (price   !== undefined) d.dailyInventory[idx].price     = price;
      if (available !== undefined) d.dailyInventory[idx].available = available;
    } else {
      d.dailyInventory.push({ id: `inv-${categoryId}-${date}`, categoryId, date, price: price || 0, available: available || 0 });
    }
    write(d);
    return d.dailyInventory.find(inv => inv.categoryId === categoryId && inv.date === date);
  },

  /* ── Bookings ── */
  getBookingsByHotel: (hotelId) => {
    const d = read();
    return d.bookings.filter(b => b.hotelId === hotelId).map(b => ({ ...b, hotelName: d.hotels.find(h => h.id === hotelId)?.name || '' }));
  },
  getAllBookings: () => {
    const d = read();
    return d.bookings.map(b => ({ ...b, hotelName: d.hotels.find(h => h.id === b.hotelId)?.name || '' }));
  },
  addBooking: (booking) => {
    const d = read();
    const bk = { id: `BK-${Date.now()}`, ...booking };
    d.bookings.push(bk);
    write(d);
    return bk;
  },

  /* ── Channels ── */
  getChannelsByHotel: (hotelId) => read().channels.filter(c => c.hotelId === hotelId),

  /* ── Stats ── */
  getStats: (hotelId) => {
    const d = read();
    const bookings  = d.bookings.filter(b => b.hotelId === hotelId);
    const hotel     = d.hotels.find(h => h.id === hotelId);
    const channels  = d.channels.filter(c => c.hotelId === hotelId);
    const rooms     = d.rooms.filter(r => r.hotelId === hotelId);
    const occupied  = rooms.filter(r => r.status === 'Occupied' || r.status === 'Checked In').length;
    const occupancy = rooms.length > 0 ? Math.round((occupied / rooms.length) * 100) : 0;
    const totalRev  = bookings.reduce((acc, b) => acc + b.totalAmount, 0);
    const active    = channels.filter(c => c.isActive).length;
    return {
      totalRevenue: totalRev,
      totalBookings: bookings.length,
      occupancy: `${occupancy}%`,
      channels: `${active} / ${channels.length}`,
      hotelName: hotel?.name || '',
      recentBookings: [...bookings].reverse().slice(0, 5),
      syncStatus: channels.map(c => ({ name: c.channelName, status: c.isActive ? 'Synced' : 'Error', time: timeSince(c.lastSync) }))
    };
  }
};
