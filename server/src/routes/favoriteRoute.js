import express from "express";
import controller from "../controllers/favoriteController.js";

const router = express.Router();

router.route("/getFavoriteData")
    .post(controller.getFavoriteData);
router.route("/setFavorite")
    .post(controller.setFavorite);



export default router;