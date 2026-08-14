const User = require("../Route/UserRoute");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ALLOWED_ROLES = ["admin", "owner", "tenant", "user"];
const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
const ADMIN_FILE_PASSWORD = "Admin@123";

const encryptBuffer = (buffer, password) => {
  const iv = crypto.randomBytes(16);
  const key = crypto.createHash("sha256").update(password).digest();
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    data: encrypted.toString("hex"),
  };
};

const decryptBuffer = (encryptedHex, ivHex, password) => {
  const iv = Buffer.from(ivHex, "hex");
  const key = crypto.createHash("sha256").update(password).digest();
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.from(encryptedHex, "hex");

  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
};

const getUserUploadFolder = (email) => {
  const safeEmail = (email || "unknown").toLowerCase().replace(/[^a-z0-9@._-]/g, "_");
  const folderName = safeEmail || "unknown";
  const userFolder = path.join(__dirname, "../uploads", folderName);

  fs.mkdirSync(userFolder, { recursive: true });
  return userFolder;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userFolder = getUserUploadFolder(req.body.email);
    cb(null, userFolder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const base = (path.basename(file.originalname || "file", ext) || "file")
      .replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "profileImage") {
      if (!allowedImageTypes.includes(file.mimetype)) {
        return cb(new Error("Only image files are allowed for profile image"), false);
      }
    }

    if (file.fieldname === "aadharCard") {
      if (file.mimetype !== "application/pdf") {
        return cb(new Error("Only PDF files are allowed for Aadhar card"), false);
      }
    }

    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

const handleCreateUser = async (req, res) => {
  const { email, password, role, mobileNumber } = req.body;
  const profileImage = req.files?.profileImage?.[0];
  const aadharCard = req.files?.aadharCard?.[0];

  if (!email || !password)
    return res.status(400).json({ error: "email and password required" });
  if (role && !ALLOWED_ROLES.includes(role))
    return res.status(400).json({ error: "invalid role" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      email,
      password: hashedPassword,
      role,
      mobileNumber,
    };

    if (profileImage) {
      const encryptedProfile = encryptBuffer(fs.readFileSync(profileImage.path), ADMIN_FILE_PASSWORD);
      userData.profileImage = {
        contentType: profileImage.mimetype,
        filename: profileImage.filename,
        path: profileImage.path,
        encryptedData: encryptedProfile.data,
        iv: encryptedProfile.iv,
        lockedWith: ADMIN_FILE_PASSWORD,
      };
    }

    if (aadharCard) {
      const encryptedAadhar = encryptBuffer(fs.readFileSync(aadharCard.path), ADMIN_FILE_PASSWORD);
      userData.aadharCard = {
        contentType: aadharCard.mimetype,
        filename: aadharCard.filename,
        path: aadharCard.path,
        encryptedData: encryptedAadhar.data,
        iv: encryptedAadhar.iv,
        lockedWith: ADMIN_FILE_PASSWORD,
      };
    }

    const user = new User(userData);
    await user.save();

    res.status(201).json({ message: "user created", user });
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ error: "email already exists" });
    res.status(500).json({ error: err.message });
  }
};

const handleLogoin = async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const secret = "Pass@222";

  if (!existingUser || !emailRegex.test(email))
    return res.status(400).send({ errorInfo: "Invalid Email" });
  const correctUser = await User.findOne({ email });

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);

  if (!correctUser || !isPasswordValid)
    return res.status(400).send({ errorInfo: "Invalid Credentials" });

  const payload = {
    id: correctUser._id,
    email: correctUser.email,
    role: correctUser.role,
    mobileNumber: correctUser.mobileNumber,
  };
  const token = jwt.sign(correctUser.toObject(), secret);
  res.cookie("uid", token);
  res.status(200).send({ message: "Login success", token: token });
};

const viewProtectedFile = async (req, res) => {
  const { email, type } = req.params;
  const { password } = req.query;

  if (!password || password !== ADMIN_FILE_PASSWORD) {
    return res.status(401).json({ error: "Password required to view this file" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const fileData = user[type];
    if (!fileData || !fileData.encryptedData || !fileData.iv) {
      return res.status(404).json({ error: "File not found" });
    }

    const decrypted = decryptBuffer(fileData.encryptedData, fileData.iv, ADMIN_FILE_PASSWORD);

    res.setHeader("Content-Type", fileData.contentType || "application/octet-stream");
    res.setHeader("Content-Disposition", `inline; filename="${fileData.filename || "document"}"`);
    return res.send(decrypted);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { handleLogoin, handleCreateUser, upload, viewProtectedFile, ADMIN_FILE_PASSWORD };
