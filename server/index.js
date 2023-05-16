import express from "express";
import http, { METHODS } from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User is Connected :${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);

    console.log(`User ${socket.id} is joined the room number ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log(`User is disconnected :${socket.id}`);
  });
});

server.listen(8001, () => {
  console.log(`SERVER IS RUNNING AT PORT ${8001}`);
});
