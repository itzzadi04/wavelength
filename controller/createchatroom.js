const Room = require('../models/room');

const createchatroom = async (req, res) => {
  try {
    const { roomid } = req.body;
    if (!roomid) {
      return res.status(400).json({ error: "roomid is required" });
    }
    const existing = await Room.findOne({ roomid });
    if (existing) {
      return res.status(409).json({ error: "Room already exists" });
    }
    const newRoom = await Room.create({ roomid });
    return res.status(201).json({ room: newRoom });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { createchatroom };






