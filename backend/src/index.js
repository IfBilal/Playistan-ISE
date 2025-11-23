import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { initializeChatSocket } from "./sockets/chat.socket.js";

dotenv.config();

let port = process.env.PORT || 8001;
console.log(process.env.CORS_ORIGIN);

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

// Make io accessible to routes
app.set("io", io);

// Initialize chat socket handlers
initializeChatSocket(io);

connectDB()
  .then(() => {
    httpServer.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Socket.IO server is ready`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error");
  });
