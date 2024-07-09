import express from "express";
import controller from "../controllers/gameController.js";

const router = express.Router();

router.route("/homeAllGames")
    .post(controller.getHomeAllGames);

router.route("/homePlatforms")
    .get(controller.getHomePlatforms);

router.route("/getGameInfo")
    .post(controller.getGameInfo);

router.route("/getAllGames")
    .post(controller.getAllGames);

router.route("/getGame")
    .post(controller.getGame);

router.route("/similarGames")
    .post(controller.getSimilarGames);

export default router;