import express from "express";
import controller from "../controllers/gameController.js";

const router = express.Router();

router.route("/homeAllGames")
    .post(controller.getHomeAllGames);

router.route("/getGameInfo")
    .post(controller.getGameInfo);

router.route("/getGame")
    .post(controller.getGame);

router.route("/similarGames")
    .post(controller.getSimilarGames);

router.route("/searchGames")
    .post(controller.searchGames);

router.route("/getGames")
    .post(controller.getGames);

router.route("/getGameFilters")
    .post(controller.getGameFilters);

export default router;