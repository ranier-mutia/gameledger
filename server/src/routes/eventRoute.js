import express from "express";
import controller from "../controllers/eventController.js";

const router = express.Router();

router.route("/getEvents")
    .post(controller.getEvents);

router.route("/event")
    .post(controller.getEvent);

router.route("/showCasedGames")
    .post(controller.getShowCasedGames);

export default router;