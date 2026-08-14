const User = require("../Route/UserRoute");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const bcrypt = require("bcrypt");
const ALLOWED_ROLES = ["admin", "owner", "tenant", "user"];

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf")
      return cb(new Error("Only PDFs are allowed"), false);
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const handleCreateUser = async (req, res) => {
  const { email, password, role, mobileNumber } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "email and password required" });
  if (role && !ALLOWED_ROLES.includes(role))
    return res.status(400).json({ error: "invalid role" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = { email, password: hashedPassword, role, mobileNumber };
    if (req.file) {
      userData.document = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname,
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

module.exports = { handleLogoin, handleCreateUser, upload };
