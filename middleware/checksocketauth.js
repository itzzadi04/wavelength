const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const socketauth = async (socket, next) => {
  try {
    const rawCookies = socket.handshake.headers.cookie;
    if (!rawCookies) return next(new Error('No cookies sent'));

    const cookies = cookie.parse(rawCookies);
    const token = cookies.user;
    if (!token) return next(new Error('No auth token'));
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findOne({ email: decoded.email }).select('-password');
    if (!user) return next(new Error('User not found'));

    socket.data.userId = user._id;
    socket.data.user = user;
    socket.data.identified = true;

    next();
  } catch (err) {
    console.error('Socket auth failed:', err.message);
    next(new Error('Authentication failed'));
  }
};

module.exports = { socketauth };