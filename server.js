const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const cors = require('cors');
const ACTIONS = require('./src/Actions');

// const { shouldProcessLinkClick } = require('react-router-dom/dist/dom');

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

//For deployement
app.use(express.static('build'));

app.use((req, res, use) =>
{
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

//to pass the user info who has joined
const userSocketMap = {};

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) =>
    {
      return {
        socketId,
        userId : userSocketMap[socketId],
      };
    }
  );
}

io.on('connect', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  socket.on(ACTIONS.JOIN, ({roomId, userId}) => {
  console.log("Joined user")
  userSocketMap[socket.id] = userId;    // userSocketMap[key] = value;
  socket.join(roomId);
  const clients = getAllConnectedClients(roomId) 
  console.log(clients);
  clients.forEach(({ socketId }) =>
  {
    io.to(socketId).emit(ACTIONS.JOINED,
      {
        clients,
        userId,
        socketId: socket.id,
      });
  });

 });

 socket.on(ACTIONS.CODE_CHANGE, ({roomId, code}) =>
 {
  // io.to(roomId).emit(ACTIONS.CODE_CHANGE, {code}); Sends changes to self as well as other clients
  socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {code}); //broadcasts to other clients only
});

socket.on(ACTIONS.SYNC_CODE, ({socketId, code}) =>
 {
  // io.to(roomId).emit(ACTIONS.CODE_CHANGE, {code}); Sends changes to self as well as other clients
  io.to(socketId).emit(ACTIONS.CODE_CHANGE, {code}); //broadcasts to other clients only
});

 socket.on('disconnecting', () => {
    const rooms = [...socket.rooms];
  rooms.forEach((roomId) =>
  {
    socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
      socketId: socket.id,
      userId: userSocketMap[socket.id],
    });
  });
  delete userSocketMap[socket.id];
  socket.leave();
 });
 



});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
