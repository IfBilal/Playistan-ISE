import { Router } from "express";
import {
  loginAdmin,
  logoutAdmin,
  pendingBookings,
  confirmBooking,
  rejectBooking,
} from "../controllers/AdminDashboard.controllers.js";
import { verifyJWTAdmin } from "../middlewares/AdminAuth.middleware.js";

const router = Router();

router.post("/login", loginAdmin);
router.post("/logout", verifyJWTAdmin, logoutAdmin);
router.get("/pending-bookings", verifyJWTAdmin, pendingBookings);
router.put("/confirm-booking", verifyJWTAdmin, confirmBooking);
router.delete("/reject-booking", verifyJWTAdmin, rejectBooking);

export default router;
