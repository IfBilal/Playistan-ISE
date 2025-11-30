import { Router } from "express";
import { addReview, getGroundReviews, getUserReviewCount } from "../controllers/review.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add").post(verifyJWT, addReview);
router.route("/:groundId").get(getGroundReviews);
router.route("/user-count/:groundId").get(verifyJWT, getUserReviewCount);

export default router;
