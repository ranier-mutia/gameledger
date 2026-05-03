import express from "express";
import controller from "../controllers/followController.js";

const router = express.Router();

router.route("/getFollowData")
    .post(controller.getFollowData);

router.route("/getSocials")
    .post(controller.getSocials);

router.route("/followUser")
    .post(controller.followUser);

router.route("/unfollowUser")
    .post(controller.unfollowUser);

export default router;