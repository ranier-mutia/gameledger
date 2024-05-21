import express from "express";
import controller from "../controllers/gameController.js";

const router = express.Router();

router.route("/homeGames")
    .post(controller.getAllGames);

router.route("/homePlatforms")
    .get(controller.getPlatforms);

router.route("/getGameInfo")
    .post(controller.getGameInfo);

export default router;