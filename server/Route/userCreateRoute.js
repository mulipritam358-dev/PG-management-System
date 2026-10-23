const express = require("express");
const router = express.Router();
const {
  handleLogoin,
  handleCreateUser,
  handleGetUsers,
  upload,
  viewProtectedFile,
} = require("../controller/userController");
const { authenticateToken, requireRole } = require("../middleware/authMiddleware");

router.get("/users", authenticateToken, requireRole("admin"), handleGetUsers);

router.post(
  "/users",
  // upload.fields([
  //   { name: "profileImage", maxCount: 1 },
  //   { name: "aadharCard", maxCount: 1 },
  // ]),
  handleCreateUser
);

// router.get("/view/:email/:type", viewProtectedFile);
router.post("/userlogin", handleLogoin);

module.exports = router;
