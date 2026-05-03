import express from "express";
import controller from "../controllers/activityController.js";

const router = express.Router();

router.route("/getUserActivities")
    .post(controller.getUserActivities);

router.route("/getAllUserActivities")
    .post(controller.getAllUserActivities);

export default router;