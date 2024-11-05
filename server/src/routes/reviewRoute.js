import express from "express";
import controller from "../controllers/reviewController.js";

const router = express.Router();

router.route("/getReviews")
    .post(controller.getReviews);

router.route("/getReview")
    .post(controller.getReview);

router.route("/getReviewData")
    .post(controller.getReviewData);

router.route("/setReview")
    .post(controller.setReview);

router.route("/deleteReview")
    .post(controller.deleteReview);

router.route("/getGameReviews")
    .post(controller.getGameReviews);

router.route("/getAllGameReviews")
    .post(controller.getAllGameReviews);

export default router;