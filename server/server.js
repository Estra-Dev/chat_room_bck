import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`user is connected with id of ${socket.id}`);

  socket.on("join-room", ({ room, userName }) => {
    socket.join(room);
    console.log(`User ${userName} joined room ${room}`);

    socket.to(room).emit("user_joined", `${userName} joined room`);
  });

  socket.on("message", ({ room, message, sender }) => {
    console.log(`Message from ${sender} in room ${room}: ${message}`);
    socket.to(room).emit("message", { sender, message });
  });

  socket.on("disconnect", () => {
    console.log(`user disconnected with id of ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on port http://localhost:${PORT}`);
});
