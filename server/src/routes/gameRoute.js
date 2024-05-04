import express from "express";
import controller from "../controllers/gameController.js";

const router = express.Router();

router.route("/")
    .get(controller.getAllGames);

export default router;