const Room = require("../Rooms/roomsRoute");

const seedRooms = async () => {
  const existingRooms = await Room.countDocuments();

  if (existingRooms > 0) {
    console.log(
      `Database already contains ${existingRooms} rooms. Skipping room seed.`,
    );
    return;
  }

  const rooms = [];

  for (let floor = 1; floor <= 4; floor++) {
    for (let roomIndex = 1; roomIndex <= 4; roomIndex++) {
      const roomNumber = `F${floor}-R${roomIndex}`;

      rooms.push({
        roomNumber,
        floorNumber: floor,
        roomType: "1RK with Hall",
        totalCapacity: 4,
        occupiedFor: "",
        beds: [
          {
            bedNumber: `${roomNumber}-H1`,
            placements: "Hall",
            status: "Vacant",
          },
          {
            bedNumber: `${roomNumber}-H2`,
            placements: "Hall",
            status: "Vacant",
          },
          {
            bedNumber: `${roomNumber}-B1`,
            placements: "Bedroom",
            status: "Vacant",
          },
          {
            bedNumber: `${roomNumber}-B2`,
            placements: "Bedroom",
            status: "Vacant",
          },
        ],
      });
    }
  }

  await Room.insertMany(rooms);

  console.log("Rooms created successfully: 16 rooms across 4 floors, with 64 beds.");
};

module.exports = seedRooms;
