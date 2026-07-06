require("dotenv").config();

const { createServer } = require("http");
const { Server } = require("socket.io");

// Health check endpoint for Render
const httpServer = createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Signaling Server is running 🚀");
  } else {
    res.writeHead(404);
    res.end();
  }
});

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Store active connections
const activeConnections = new Map();

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join-room", (appointmentId) => {
    socket.join(appointmentId);
    activeConnections.set(socket.id, appointmentId);
    console.log(`Client ${socket.id} joined room ${appointmentId}`);
  });

  socket.on("offer", (data) => {
    socket.to(data.appointmentId).emit("offer", data.offer);
  });

  socket.on("answer", (data) => {
    socket.to(data.appointmentId).emit("answer", data.answer);
  });

  socket.on("ice-candidate", (data) => {
    socket.to(data.appointmentId).emit("ice-candidate", data.candidate);
  });

  socket.on("call-accepted", (data) => {
    socket.to(data.appointmentId).emit("call-accepted");
  });

  socket.on("call-rejected", (data) => {
    socket.to(data.appointmentId).emit("call-rejected");
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    activeConnections.delete(socket.id);
  });
});

const PORT = process.env.PORT || process.env.SIGNALING_PORT || 3001;

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Signaling server running on port ${PORT}`);
});