import express from "express";
import controller from "../controllers/userController.js";

const router = express.Router();

router.route("/validateUser")
    .post(controller.validateUser);

router.route("/validateEmail")
    .post(controller.validateEmail);

router.route("/registerUser")
    .post(controller.registerUser);

export default router;