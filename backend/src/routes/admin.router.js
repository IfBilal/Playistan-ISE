import { Router } from "express";
import {
  loginAdmin,
  logoutAdmin,
  pendingBookings,
  confirmedBookings,
  confirmBooking,
  rejectBooking,
  cancelBooking,
} from "../controllers/AdminDashboard.controllers.js";
import { verifyJWTAdmin } from "../middlewares/AdminAuth.middleware.js";

const router = Router();

router.post("/login", loginAdmin);
router.post("/logout", verifyJWTAdmin, logoutAdmin);
router.get("/pending-bookings", verifyJWTAdmin, pendingBookings);
router.get("/confirmed-bookings", verifyJWTAdmin, confirmedBookings);
router.put("/confirm-booking", verifyJWTAdmin, confirmBooking);
router.delete("/reject-booking", verifyJWTAdmin, rejectBooking);
router.delete("/cancel-booking", verifyJWTAdmin, cancelBooking);

export default router;
