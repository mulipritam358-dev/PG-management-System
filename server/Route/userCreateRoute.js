const express = require("express");
const router = express.Router();
const {handleLogoin, handleCreateUser, upload} = require("../controller/userController")

router.post("/users", upload.single("document"), handleCreateUser  );

router.post("/userlogin", handleLogoin);

module.exports = router;