import express from "express";
import controller from "../controllers/preferenceController.js";

const router = express.Router();

router.route("/getFavoriteData")
    .post(controller.getFavoriteData);

router.route("/setFavorite")
    .post(controller.setFavorite);

router.route("/setReviewPreference")
    .post(controller.setReviewPreference);


export default router;