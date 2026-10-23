const Room = require("../Route/Rooms/roomsRoute");

const vacantBed = async (req, res) => {
  try {
    const { roomNumber, bedId } = req.params;
    const room = await Room.findOne({ roomNumber });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const bed = room.beds.id(bedId);
    if (!bed) {
      return res.status(404).json({
        success: false,
        message: "Bed not found in this room",
      });
    }

    if (bed.status === "Vacant") {
      return res.status(400).json({
        success: false,
        message: "Bed is already vacant",
      });
    }

    bed.status = "Vacant";
    bed.occupantName = null;
    bed.contactNumber = null;
    bed.gender = null;
    bed.joiningDate = null;
    bed.lastDate = null;

    const remainingOccupant = room.beds.find(
      (roomBed) => roomBed.status === "Occupied",
    );
    room.occupiedFor = remainingOccupant ? remainingOccupant.gender : "";

    await room.save();
    return res.status(200).json({
      success: true,
      message: `Bed ${bed.bedNumber} is now ${bed.status}`,
      data: {
        roomNumber: room.roomNumber,
        bed,
        occupiedFor: room.occupiedFor,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Failed to make bed vacant:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const updatedBedStatus = async (req, res) => {
  try {
    const { roomNumber, bedId } = req.params;
    const { status } = req.body || {};
    const allowedStatuses = ["Occupied", "Vacant", "Maintenance"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const room = await Room.findOne({ roomNumber });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const bed = room.beds.id(bedId);

    if (!bed) {
      return res.status(404).json({
        success: false,
        message: "Bed not found in this room",
      });
    }

    const currentOccupant = room.beds.find(
      (roomBed) => roomBed.status === "Occupied",
    );
    if (
      status === "Occupied" &&
      currentOccupant &&
      currentOccupant.gender !== req.body.gender
    ) {
      return res.status(401).json({
        success: false,
        message: `This room is available only for ${currentOccupant.gender}`,
      });
    }

    if (status === "Occupied") {
      if (bed.status === "Occupied") {
        return res.status(400).json({
          success: false,
          message: "This bed is already occupied",
        });
      }

      if (bed.status === "Maintenance") {
        return res.status(400).json({
          success: false,
          message: "This bed is under maintenance. Choose another bed.",
        });
      }

      const { occupantName, gender, contactNumber, joiningDate, lastDate } =
        req.body;

      if (
        typeof occupantName !== "string" ||
        !occupantName.trim() ||
        typeof contactNumber !== "string" ||
        !contactNumber.trim() ||
        !gender
      ) {
        return res.status(400).json({
          success: false,
          message: "Occupant name, gender, and contact number are required",
        });
      }

      if (!["Male", "Female"].includes(gender)) {
        return res.status(400).json({
          success: false,
          message: "Invalid gender",
        });
      }

      const parsedJoiningDate = new Date(joiningDate);

      let parsedLastDate;
      if (lastDate !== undefined && lastDate !== null && lastDate !== "") {
        parsedLastDate = new Date(lastDate);
        if (Number.isNaN(parsedLastDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid last date",
          });
        }
      }

      bed.status = "Occupied";
      bed.occupantName = occupantName.trim();
      bed.contactNumber = contactNumber.trim();
      bed.gender = gender;
      bed.joiningDate = parsedJoiningDate;
      bed.lastDate = parsedLastDate || null;
      room.occupiedFor = gender;
    } else {
      bed.status = status;
      bed.occupantName = null;
      bed.gender = null;
      bed.contactNumber = null;
      bed.joiningDate = null;
      bed.lastDate = null;

      const remainingOccupant = room.beds.find(
        (roomBed) => roomBed.status === "Occupied",
      );
      room.occupiedFor = remainingOccupant ? remainingOccupant.gender : "";
    }

    await room.save();

    return res.status(200).json({
      success: true,
      message: `Bed ${bed.bedNumber} is now ${bed.status}`,
      data: {
        roomNumber: room.roomNumber,
        floorNumber: room.floorNumber,
        bed,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Failed to update bed status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .sort({ floorNumber: 1, roomNumber: 1 })
      .lean();

    const result = rooms.map((room) => {
      const beds = room.beds || [];

      const occupiedBeds = beds.filter(
        (bed) => bed.status === "Occupied",
      ).length;

      const vacantBeds = beds.filter((bed) => bed.status === "Vacant").length;

      const maintenanceBeds = beds.filter(
        (bed) => bed.status === "Maintenance",
      ).length;

      return {
        ...room,
        occupiedBeds,
        vacantBeds,
        maintenanceBeds,
        roomStatus:
          vacantBeds === beds.length
            ? "Vacant"
            : vacantBeds === 0
              ? "Full"
              : "Partial",
      };
    });

    return res.status(200).json({
      success: true,
      totalRooms: result.length,
      totalBeds: result.reduce(
        (sum, room) => sum + (room.beds || []).length,
        0,
      ),
      rooms: result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch room availability",
    });
  }
};

module.exports = { updatedBedStatus, getAllRooms, vacantBed };
