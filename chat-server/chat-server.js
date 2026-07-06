require("dotenv").config();

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();

// Health check route
app.get("/", (req, res) => {
    res.send("Chat Server is running 🚀");
});

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinRoom", ({ chatRoomId }) => {
        socket.join(chatRoomId);
    });

    socket.on("leaveRoom", ({ chatRoomId }) => {
        socket.leave(chatRoomId);
    });

    socket.on("sendMessage", ({ chatRoomId, message }) => {
        socket.to(chatRoomId).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
        console.log("Disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 3002;

httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Chat server running on ${PORT}`);
});