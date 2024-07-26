import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import authRouter from "./routes/Authentication";
import userRouter from "./routes/Users";
import ChatRouter from "./routes/Chat";
import ChannelRouter from "./routes/Channel";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { postChat, updateChat } from "./controller/ChatController";
import bodyParser from "body-parser";
import { Socket, SocketOptions } from "socket.io-client";

const port = process.env.SERVER_PORT || 3000;
const DBURI = process.env.MONGO_URI || "";

const app = express();
app.use(bodyParser.raw({ type: ["image/jpeg", "image/png", "image/jpg"], limit: 52428800 }));
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*", // You can specify your frontend URL instead of "*"
    methods: ["GET", "POST"],
  },
});
app.use(cors({ origin: "*" }));
io.listen(5000);

let onlineUsers = new Map();
let focusedRooms = new Map();

io.on("connection", (socket) => {
  socket.on("login", (userId: string) => {
    if (onlineUsers.has(userId)) {
      const prev = onlineUsers.get(userId);
      if (prev) {
        io.to(prev).emit("duplicateuser", prev);
      }
      console.log("previos", prev, socket.id);
      console.log("Already LoggedIn", socket.id, userId);
    }
    onlineUsers.set(userId, socket.id);
    console.log(onlineUsers);
    io.emit("updateOnlineUsers", Array.from(onlineUsers.keys()));
  });
  socket.on("roomId", (roomId:string) => {
    console.log("roomId",roomId)
    socket.join(roomId)
  })

  // socket.on(`send-message`, (message: any) => {
  //   const messageReceiver = onlineUsers.get(message.receiver);
  //   const messageSender = onlineUsers.get(message.sender);
  //   console.log("messageSender", messageSender);
  //   // updateChat(message);
  //   io.to(messageSender).emit(`message`, message);
  //   if (messageReceiver) {
  //     io.to(messageReceiver).emit(`message`, message);
  //   }
  // });

  socket.on("new-message", (message: any) => {
    console.log("new-message",message)
    io.to(message.room_id).emit(`message`, message)
    postChat(message);
  });

  socket.on("focus", (roomId: string) => {
    focusedRooms.set(roomId, socket.id);
    io.emit("focusedRoom", Array.from(focusedRooms));
  });

  socket.on("unFocus", (room_id: string) => {
    for (let [roomId, socketId] of focusedRooms.entries()) {
      if (socketId === socket.id) {
        focusedRooms.delete(roomId);
        break;
      }
    }
    io.emit("focusedRoom", Array.from(focusedRooms));
  });

  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit("updateOnlineUsers", Array.from(onlineUsers.keys()));
  });
});

mongoose.connect(DBURI).then(() =>
  server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  })
);

app.use(express.json());
app.use(authRouter);
app.use(userRouter);
app.use(ChatRouter);
app.use(ChannelRouter);
