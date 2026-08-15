const jwt = require('jsonwebtoken');
require('dotenv').config();

const checkauth = async (req, res, next) => {
  try {
    const token = req.cookies?.user; 

    if (!token) {
      return res.status(401).json({ err: "No token found" });
    }
    const decodeduser = jwt.verify(token, process.env.SECRET);
    if (!decodeduser) {
      return res.status(401).json({ err: "Invalid token" });
    }
    req.user = decodeduser;
    next();
  } catch (err) {
    console.error('Auth check failed:', err.message);
    return res.status(401).json({ err: "Authentication failed" });
  }
};

module.exports = { checkauth };