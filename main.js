require('dotenv').config() 
const http = require(`http`)
const express = require(`express`)
const path = require(`path`)
const cors = require(`cors`)
const app = express()
const cookieParser=require("cookie-parser")
const authRoutes = require('./routes/authroutes');

const { Server } = require("socket.io");
const { router } = require(`./routes/routes`)
const mongoose = require(`mongoose`)
const User = require(`./models/users`)
const { handlejoinroom, handlechat, handleexit } = require(`./controller/chat`)

const { socketauth } = require('./middleware/checksocketauth');

async function main() {

  app.use(express.json())
  app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  }));

  app.use(express.urlencoded({ extended: false }))
  app.use(cookieParser()) 
  app.use(`/api`, router)
  app.use(express.static("public"));
  app.use('/api/auth', authRoutes);

  await mongoose.connect(process.env.MONGO_URI).then(console.log(`db connected`))

  const server = http.createServer(app)

  const PORT = process.env.PORT || 5000
  server.listen(PORT, () => console.log(`listening on port ${PORT}`))

  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true
    }
  })

  io.use(socketauth);

  io.on('connection', (socket) => {
    console.log(`${socket.data.user.name} connected`);
    socket.emit('identified', { msg: 'User verified', user: socket.data.user });

    handlejoinroom(socket, io);
    handlechat(socket, io);
    handleexit(socket, io);

    socket.on('disconnect', (reason) => {
      console.log(`${socket.data.user.name} disconnected:`, reason);
    });
  });
}

main()