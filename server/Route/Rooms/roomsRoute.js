const mongoose = require("mongoose");

const bedSchema = new mongoose.Schema(
  {
    bedNumber: {
      type: String,
      required: true,
    },

    placements: {
      type: String,
      enum: ["Hall", "Bedroom"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Vacant", "Occupied", "Maintenance"],
      default: "Vacant",
    },

    occupantName: {
      type: String,
      default: null,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other", null],
      default: null,
    },

    contactNumber: {
      type: String,
      default: null,
    },

    joiningDate: {
      type: Date,
      default: null,
    },

    lastDate: {
      type: Date,
      default: null,
    },
  },
  { _id: true },
);

bedSchema.pre("validate", function () {
  if (this.status === "Occupied") {
    if (!this.occupantName) {
      throw new Error("Occupant name is required when bed is occupied");
    }

    if (!this.gender) {
      throw new Error("Gender is required when bed is occupied");
    }

    if (!this.contactNumber) {
      throw new Error("Contact number is required when bed is occupied");
    }

    if (!this.joiningDate) {
      // throw new Error("Joining date is required when bed is occupied");
      this.joiningDate = new Date();
    }

    // if (!this.lastDate && this.joiningDate) {
    //   const calculatedLastDate = new Date(this.joiningDate);
    //   calculatedLastDate.setDate(calculatedLastDate.getDate() + 32);
    //   this.lastDate = calculatedLastDate;
    // }
    // Set checkout date to 30 days after joining date
    if (!this.lastDate) {
      const calculatedLastDate = new Date(this.joiningDate);

      calculatedLastDate.setDate(calculatedLastDate.getDate() + 30);

      this.lastDate = calculatedLastDate;
    }
  }

  if (this.status !== "Occupied") {
    this.occupantName = null;
    this.gender = null;
    this.contactNumber = null;
    this.joiningDate = null;
    this.lastDate = null;
  }
});

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    }, // e.g., "101", "102"

    floorNumber: {
      type: Number,
      required: true,
    }, // e.g., 1 for First Floor

    roomType: {
      type: String,
      default: "1RK with Hall",
    },

    totalCapacity: {
      type: Number,
      default: 4,
      required: true,
    }, // Total beds in the room (e.g., 4)

    occupiedFor: {
      type: String,
    },

    beds: [bedSchema], // Array containing the 4 beds (2 Hall, 2 Bedroom)
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
);

// 3. Indexes for Optimized Admin Queries
roomSchema.index({ floorNumber: 1 });
roomSchema.index({ "beds.status": 1 }); // Fast lookup to find vacant/occupied beds across floors

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
