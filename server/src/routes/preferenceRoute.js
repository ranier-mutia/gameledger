import express from "express";
import controller from "../controllers/preferenceController.js";

const router = express.Router();

router.route("/getFavoriteData")
    .post(controller.getFavoriteData);

router.route("/setFavorite")
    .post(controller.setFavorite);

router.route("/setReviewPreference")
    .post(controller.setReviewPreference);

router.route("/getFavoriteGames")
    .post(controller.getFavoriteGames);

router.route("/getAllFavoriteGames")
    .post(controller.getAllFavoriteGames);

router.route("/setActivityPreference")
    .post(controller.setActivityPreference);


export default router;