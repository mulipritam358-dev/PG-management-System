const express = require("express");
const router = express.Router();
const {
  handleLogoin,
  handleCreateUser,
  upload,
  viewProtectedFile,
} = require("../controller/userController");

router.post(
  "/users",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "aadharCard", maxCount: 1 },
  ]),
  handleCreateUser
);

// router.get("/view/:email/:type", viewProtectedFile);
router.post("/userlogin", handleLogoin);

module.exports = router;
