import express from "express";
import controller from "../controllers/eventController.js";

const router = express.Router();

router.route("/")
    .get(controller.getEvents);

export default router;