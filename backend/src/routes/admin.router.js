import { Router } from "express";
import {
  loginAdmin,
  logoutAdmin,
  pendingBookings,
  confirmedBookings,
  confirmBooking,
  rejectBooking,
  cancelBooking,
  createAdmin,
} from "../controllers/AdminDashboard.controllers.js";
import { verifyJWTAdmin } from "../middlewares/AdminAuth.middleware.js";
import { uploadImages } from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/login", loginAdmin);
router.post("/logout", verifyJWTAdmin, logoutAdmin);
router.get("/pending-bookings", verifyJWTAdmin, pendingBookings);
router.get("/confirmed-bookings", verifyJWTAdmin, confirmedBookings);
router.put("/confirm-booking", verifyJWTAdmin, confirmBooking);
router.delete("/reject-booking", verifyJWTAdmin, rejectBooking);
router.delete("/cancel-booking", verifyJWTAdmin, cancelBooking);
router.post(
  "/create-admin",
  uploadImages.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
    {
      name: "photos",
      maxCount: 10,
    },
  ]),
  createAdmin
);

export default router;
