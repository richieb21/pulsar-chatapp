import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { Server } from 'socket.io';

import userRoutes from './routes/userRoutes.js';
import messageRoutes from './routes/messagesRoute.js';
import { createServer } from 'http';

dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/auth", messageRoutes);

mongoose.connect(process.env.MONGO_URL, {}).then(() => {
    console.log("connected successfully");
}).catch((err) => {
    console.log(err)
})

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin:"http://localhost:3001",
        credentials: true,
    }
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    })

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket){
            socket.to(sendUserSocket).emit("msg-receive", data.msg);
        }
    })
})

httpServer.listen(3003, () => {
    console.log(`Socket started on port 3003`);
  });