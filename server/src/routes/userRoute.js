import express from "express";
import controller from "../controllers/userController.js";

const router = express.Router();

router.route("/login")
    .post(controller.login);

router.route("/login/success")
    .get(controller.loginSuccess);

router.route("/login/failure")
    .get(controller.loginFailure);

router.route("/authUser")
    .post(controller.authUser);

router.route("/googleAuth")
    .get(controller.googleAuth);

router.route("/googleAuth/callback")
    .get(controller.googleAuthCallback);

router.route("/logout")
    .post(controller.logout);

router.route("/validateEmail")
    .post(controller.validateEmail);

router.route("/registerUser")
    .post(controller.registerUser);

router.route("/forgotPassword")
    .post(controller.forgotPassword);

router.route("/verifyOTP")
    .post(controller.verifyOTP);

router.route("/resetPassword")
    .post(controller.resetPassword);

export default router;