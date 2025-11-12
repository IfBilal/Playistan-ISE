import { Router } from "express";
import {
  bookedGrounds,
  confirmBooking,
  BookGround,
  confirmedBookings,
} from "../controllers/booking.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadImages } from "../middlewares/multer.middleware.js";
import { verifyJWTAdmin } from "../middlewares/AdminAuth.middleware.js";

const router = Router();

router.route("/:groundId/:date").get(verifyJWT, bookedGrounds);

router
  .route("/book")
  .post(verifyJWT, uploadImages.single("paymentScreenshot"), BookGround);

router.route("/confirm").put(verifyJWTAdmin, confirmBooking);

router.route("/confirm-bookings/:groundId").get(verifyJWTAdmin, confirmedBookings);

export default router;
