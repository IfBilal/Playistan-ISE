import { Router } from "express";
import {
  getChatHistory,
  uploadChatMedia,
  deleteMessage,
  markAsRead,
  getOnlineUsers,
} from "../controllers/chat.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

// Get chat history
router.route("/history").get(getChatHistory);

// Upload media (image/video) - returns URL to use in socket message
router.route("/upload-media").post(upload.single("media"), uploadChatMedia);

// Delete a message
router.route("/message/:messageId").delete(deleteMessage);

// Mark messages as read
router.route("/mark-read").post(markAsRead);

// Get online users
router.route("/online-users").get(getOnlineUsers);

export default router;
