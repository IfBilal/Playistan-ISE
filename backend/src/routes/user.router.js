import { Router } from "express";
import {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  logoutUser,
  changePassword,
  updateAccountDetails,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

let router = Router();

router.route("/register").post(registerUser);
router.route("/verify-otp").post(verifyOTP);
router.route("/resend-otp").post(resendOTP);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/update-account-details").post(verifyJWT, updateAccountDetails);

export default router;
