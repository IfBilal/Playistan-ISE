import { Message } from "../models/message.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Get chat history with pagination
const getChatHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;

  const messages = await Message.find({ isDeleted: false })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate("sender", "username email")
    .lean();

  const total = await Message.countDocuments({ isDeleted: false });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        messages: messages.reverse(), // Reverse to show oldest first
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      },
      "Chat history retrieved successfully"
    )
  );
});

// Upload media for chat (images/videos)
const uploadChatMedia = asyncHandler(async (req, res) => {
  const { messageType } = req.body; // 'image' or 'video'

  if (!req.file) {
    throw new ApiError(400, "Media file is required");
  }

  if (!["image", "video"].includes(messageType)) {
    throw new ApiError(400, "Invalid message type");
  }

  // Upload to cloudinary
  const uploadedFile = await uploadOnCloudinary(req.file.path);

  if (!uploadedFile) {
    throw new ApiError(500, "Failed to upload media");
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        mediaUrl: uploadedFile.url,
        mediaPublicId: uploadedFile.public_id,
        messageType,
      },
      "Media uploaded successfully"
    )
  );
});

// Delete a message (soft delete)
const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user._id;

  const message = await Message.findById(messageId);

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  // Only sender can delete their message
  if (message.sender.toString() !== userId.toString()) {
    throw new ApiError(403, "You can only delete your own messages");
  }

  message.isDeleted = true;
  await message.save();

  // Emit socket event to notify all users
  const io = req.app.get("io");
  io.emit("message:deleted", { messageId });

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Message deleted successfully"));
});

// Mark messages as read
const markAsRead = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { messageIds } = req.body; // Array of message IDs

  if (!Array.isArray(messageIds) || messageIds.length === 0) {
    throw new ApiError(400, "Message IDs array is required");
  }

  await Message.updateMany(
    {
      _id: { $in: messageIds },
      "readBy.user": { $ne: userId },
    },
    {
      $push: {
        readBy: {
          user: userId,
          readAt: new Date(),
        },
      },
    }
  );

  res.status(200).json(new ApiResponse(200, {}, "Messages marked as read"));
});

// Get online users count
const getOnlineUsers = asyncHandler(async (req, res) => {
  const io = req.app.get("io");
  const onlineUsers = [];

  // Get all connected sockets
  const sockets = await io.fetchSockets();

  sockets.forEach((socket) => {
    if (socket.data.user) {
      onlineUsers.push({
        userId: socket.data.user._id,
        username: socket.data.user.username,
      });
    }
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, { count: onlineUsers.length, users: onlineUsers }, "Online users retrieved")
    );
});

export {
  getChatHistory,
  uploadChatMedia,
  deleteMessage,
  markAsRead,
  getOnlineUsers,
};
