const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "owner", "tenant", "user"],
    required: true,
    default: "user",
  },
  mobileNumber: {
    type: Number,
    required: true,
  },
  profileImage: {
    data: Buffer,
    contentType: String,
    filename: String,
    path: String,
    encryptedData: String,
    iv: String,
    lockedWith: String,
  },
  aadharCard: {
    data: Buffer,
    contentType: String,
    filename: String,
    path: String,
    encryptedData: String,
    iv: String,
    lockedWith: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;