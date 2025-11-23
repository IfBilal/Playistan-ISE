import { Router } from "express";
import {
  getChatHistory,
  uploadChatImage,
  uploadChatVideo,
  deleteMessage,
  markAsRead,
  getOnlineUsers,
} from "../controllers/chat.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadImages,uploadVideos } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/history").get(getChatHistory);

router.route("/upload-image").post(uploadImages.single("image"), uploadChatImage);

router.route("/upload-video").post(uploadVideos.single("video"), uploadChatVideo);

router.route("/message/:messageId").delete(deleteMessage);

router.route("/mark-read").post(markAsRead);

router.route("/online-users").get(getOnlineUsers);

export default router;
