import express from "express";
import controller from "../controllers/userController.js";

const router = express.Router();

router.route("/")
    .get(controller.getUsers);

export default router;