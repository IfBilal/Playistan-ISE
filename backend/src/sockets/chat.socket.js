import { Message } from "../models/message.models.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";

export const initializeChatSocket = (io) => {
  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      // Extract token from multiple possible locations
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers.authorization?.replace("Bearer ", "") ||
        socket.handshake.query.token;

      if (!token) {
        console.log("Socket connection rejected: No token provided");
        return next(new Error("Authentication token required"));
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      
      if (!decoded || !decoded.id) {
        console.log("Socket connection rejected: Invalid token structure");
        return next(new Error("Invalid token"));
      }

      // Find user in database
      const user = await User.findById(decoded.id).select("-password -refreshToken");

      if (!user) {
        console.log(`Socket connection rejected: User not found for ID ${decoded.id}`);
        return next(new Error("User not found"));
      }

      // Check if user is verified (optional - remove if not needed)
      if (!user.isVerified) {
        console.log(`Socket connection rejected: User ${user.username} is not verified`);
        return next(new Error("User not verified"));
      }

      // Store user in socket data
      socket.data.user = user;
      console.log(`Socket authentication successful for user: ${user.username}`);
      next();
    } catch (error) {
      console.error("Socket authentication error:", error.message);
      if (error.name === "JsonWebTokenError") {
        return next(new Error("Invalid token"));
      }
      if (error.name === "TokenExpiredError") {
        return next(new Error("Token expired"));
      }
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data.user;
    console.log(`User connected: ${user.username} (${socket.id})`);

    socket.join("community-chat");

    socket.broadcast.emit("user:joined", {
      userId: user._id,
      username: user.username,
      message: `${user.username} joined the chat`,
    });

    socket.on("message:send", async (data) => {
      try {
        const { messageType, content, mediaUrl, mediaPublicId } = data;

        // Validate message
        if (!["text", "image", "video"].includes(messageType)) {
          socket.emit("error", { message: "Invalid message type" });
          return;
        }

        if (messageType === "text" && !content) {
          socket.emit("error", { message: "Text content is required" });
          return;
        }

        if ((messageType === "image" || messageType === "video") && !mediaUrl) {
          socket.emit("error", { message: "Media URL is required" });
          return;
        }

        // Create message in database
        const message = await Message.create({
          sender: user._id,
          messageType,
          content: content || "",
          mediaUrl: mediaUrl || "",
          mediaPublicId: mediaPublicId || "",
        });

        // Populate sender info
        await message.populate("sender", "username email");

        // Broadcast to all users in the room
        io.to("community-chat").emit("message:new", {
          _id: message._id,
          sender: {
            _id: message.sender._id,
            username: message.sender.username,
            email: message.sender.email,
          },
          messageType: message.messageType,
          content: message.content,
          mediaUrl: message.mediaUrl,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
        });
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // User typing indicator
    socket.on("typing:start", () => {
      socket.broadcast.to("community-chat").emit("user:typing", {
        userId: user._id,
        username: user.username,
      });
    });

    socket.on("typing:stop", () => {
      socket.broadcast.to("community-chat").emit("user:stopped-typing", {
        userId: user._id,
      });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${user.username} (${socket.id})`);
      
      socket.broadcast.to("community-chat").emit("user:left", {
        userId: user._id,
        username: user.username,
        message: `${user.username} left the chat`,
      });
    });

    // Get online users
    socket.on("users:online", async () => {
      const sockets = await io.in("community-chat").fetchSockets();
      const onlineUsers = sockets.map((s) => ({
        userId: s.data.user._id,
        username: s.data.user.username,
      }));

      socket.emit("users:online-list", {
        count: onlineUsers.length,
        users: onlineUsers,
      });
    });
  });
};
