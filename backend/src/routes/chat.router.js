import { Router } from "express";
import {
  getChatHistory,
  sendTextMessage,
  sendImageMessage,
  sendVideoMessage,
  deleteMessage,
  markAsRead,
  getOnlineUsers,
} from "../controllers/chat.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadImages,uploadVideos } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/history").get(getChatHistory);

router.route("/send-text").post(sendTextMessage);

router.route("/send-image").post(uploadImages.single("image"), sendImageMessage);

router.route("/send-video").post(uploadVideos.single("video"), sendVideoMessage);

router.route("/message/:messageId").delete(deleteMessage);

router.route("/mark-read").post(markAsRead);

router.route("/online-users").get(getOnlineUsers);

export default router;
