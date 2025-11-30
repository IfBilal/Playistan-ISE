import { Router } from "express";
import {
  bookedGrounds,
  BookGround,
} from "../controllers/booking.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadImages } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/:groundId/:date").get(verifyJWT, bookedGrounds);

router
  .route("/book")
  .post(verifyJWT, uploadImages.single("paymentScreenshot"), BookGround);

export default router;
