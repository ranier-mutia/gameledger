import express from "express";
import controller from "../controllers/eventController.js";

const router = express.Router();

router.route("/ongoingEvents")
    .post(controller.getOngoingEvents);

router.route("/pastEvents")
    .post(controller.getPastEvents);

export default router;