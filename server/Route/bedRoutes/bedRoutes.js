const express = require("express");
const router = express.Router();
const { updatedBedStatus, getAllRooms, vacantBed } = require("../../controller/bedcontroller");

router.patch("/rooms/:roomNumber/beds/:bedId", updatedBedStatus);
router.get("/rooms", getAllRooms);
router.delete("/vacantBed/:roomNumber/beds/:bedId", vacantBed)
module.exports = router;
