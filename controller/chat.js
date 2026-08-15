const Room = require(`../models/room`)
const User = require(`../models/users`)
const Messages = require(`../models/message`)


function handlejoinroom(socket,io) {
  socket.on('joinRoom', async (roomId) => {
    try {
      const room = await Room.findOne({ roomid:roomId });
      if (!room) {
        socket.emit('error', { msg: 'Room not found' });
        return;
      }

      const userId = socket.data.userId;

      socket.join(roomId);
      room.members.push(userId); 
      await room.save();

      const history = await Messages.find({ chatroom: room._id })
      .sort({ createdAt: 1 })
      .populate('createdby', 'name');

+      socket.emit('roomHistory', history);
      io.to(roomId).emit('userJoined', { userId });
    } catch (err) {
      console.error(err);
    }
  });
}


function handlechat(socket, io) {
  socket.on('chatMessage', async (roomId, text) => {
    try {

      const room = await Room.findOne({roomid:roomId});
      if (!room) {
        socket.emit('error', { msg: 'Room not found' });
        return;
      }

 
      const msg = await Messages.create({
        message: text,
        createdby: socket.data.userId,  
        chatroom: room._id
      });

      const populatedMsg = await msg.populate('createdby', 'name');


      io.to(roomId).emit('chatMessage', populatedMsg);
    } catch (err) {
      console.error('Error in chatMessage:', err);
      socket.emit('error', { msg: 'Failed to send message' });
    }
  });
}

function handleexit(socket,io) {
  socket.on('leaveRoom', async (roomId) => {
    try {
      const room = await Room.findOne({ roomid:roomId });
      if (!room) {
        socket.emit('error', { msg: 'Room not found' });
        return;
      }

      const userId = socket.data.userId;

      socket.leave(roomId);
      room.members.pull(userId); 
      await room.save();

      io.to(roomId).emit('userLeft', { userId });
    } catch (err) {
      console.error(err);
    }
  });
}

module.exports={handlejoinroom,handlechat,handleexit};