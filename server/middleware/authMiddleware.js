const jwt = require("jsonwebtoken");
const User = require("../Route/UserRoute");
const { JWT_SECRET } = require("../config");

const getToken = (req) => {
  const authorization = req.headers.authorization;
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.slice(7);
  }

  const cookie = req.headers.cookie
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("uid="));

  return cookie ? cookie.slice(4) : null;
};

const authenticateToken = async (req, res, next) => {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not configured");
    return res.status(500).json({ error: "Authentication is not configured" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string" || !decoded.sub) {
      return res.status(401).json({ error: "Invalid authentication token" });
    }

    const user = await User.findById(decoded.sub).select("_id email role mobileNumber");
    if (!user) {
      return res.status(401).json({ error: "Invalid authentication token" });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      mobileNumber: user.mobileNumber,
    };
    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Invalid or expired authentication token" });
    }

    return next(error);
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ error: "You do not have permission to access this resource" });
  }
  return next();
};

module.exports = { authenticateToken, requireRole };
