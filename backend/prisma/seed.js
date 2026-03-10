const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.dailyInventory.deleteMany();
  await prisma.room.deleteMany();
  await prisma.roomCategory.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.channelConfig.deleteMany();
  await prisma.user.deleteMany();
  await prisma.hotel.deleteMany();

  const hotelsData = [
    {
      name: 'Erbil Grand Heritage',
      address: 'Bakhtiari St',
      city: 'Erbil',
      contact: '+964 750 000 1111',
      email: 'info@erbilgrand.com',
      currency: 'IQD',
    },
    {
      name: 'Baghdad Palace Hotel',
      address: 'Abu Nuwas St',
      city: 'Baghdad',
      contact: '+964 780 000 2222',
      email: 'stay@baghdadpalace.com',
      currency: 'IQD',
    },
    {
      name: 'Basra International',
      address: 'Corniche St',
      city: 'Basra',
      contact: '+964 770 000 3333',
      email: 'reservations@basraint.com',
      currency: 'IQD',
    }
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const hData of hotelsData) {
    const hotel = await prisma.hotel.create({ data: hData });

    // Room Categories for each hotel
    const singleCat = await prisma.roomCategory.create({
      data: {
        hotelId: hotel.id,
        name: 'Single Room',
        basePrice: 150000,
        capacity: 1,
      }
    });

    const doubleCat = await prisma.roomCategory.create({
      data: {
        hotelId: hotel.id,
        name: 'Double Room',
        basePrice: 250000,
        capacity: 2,
      }
    });

    // Daily Inventory for 14 days
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      await prisma.dailyInventory.create({
        data: {
          date,
          categoryId: singleCat.id,
          price: singleCat.basePrice + (Math.random() > 0.8 ? 25000 : 0),
          available: Math.floor(Math.random() * 5) + 2
        }
      });

      await prisma.dailyInventory.create({
        data: {
          date,
          categoryId: doubleCat.id,
          price: doubleCat.basePrice + (Math.random() > 0.8 ? 40000 : 0),
          available: Math.floor(Math.random() * 8) + 3
        }
      });
    }

    // Channels
    await prisma.channelConfig.createMany({
      data: [
        { hotelId: hotel.id, channelName: 'Booking.com', isActive: true },
        { hotelId: hotel.id, channelName: 'Expedia', isActive: true },
      ]
    });
  }

  console.log('Database seeded with 3 hotels and 14 days of inventory each!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
