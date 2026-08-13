require('dotenv').config() 
const http = require(`http`)
const express = require(`express`)
const path = require(`path`)
const cors = require(`cors`)
const app = express()

const { Server } = require("socket.io");
const { router } = require(`./routes/routes`)
const mongoose = require(`mongoose`)
const User = require(`./models/users`)
const { handlejoinroom, handlechat, handleexit } = require(`./controller/chat`)

async function main() {

  app.use(express.json())
  app.use(cors({
    origin: "*", 
    credentials: true
  }));

  app.use(express.urlencoded({ extended: false }))
  app.use(`/api`, router)
  app.use(express.static("public"));

  await mongoose.connect(process.env.MONGO_URI)
  console.log(`db connected`)
  
  const server = http.createServer(app)
  

  const PORT = process.env.PORT || 5000
  server.listen(PORT, () => console.log(`listening on port ${PORT}`))
  
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  })

  //assign user
  io.on('connection', (socket) => {
    console.log(`someone detected`)
    socket.on('identify', async (username) => {
      socket.on('disconnect', (reason) => {
        console.log('SOCKET DISCONNECTED:', reason);
      });
      if (socket.data.identified) {
        socket.emit('identified', { msg: 'Already identified' });
        return;
      }
      try {
        const user = await User.findOne({ name: username });
        if (!user) {
          socket.emit('error', { msg: 'User not found in DB' });
          return;
        }
        socket.data.userId = user._id;
        socket.data.identified = true; 
        socket.emit('identified', { msg: 'User verified', user });

        handlejoinroom(socket, io);
        handlechat(socket, io);
        handleexit(socket, io);
      } catch (err) {
        console.error(err);
        socket.emit('error', { msg: 'DB error during identify' });
      }
    });
  });
}

main()
