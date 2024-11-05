import express from "express";
import controller from "../controllers/listController.js";

const router = express.Router();

router.route("/getListData")
    .post(controller.getListData);

router.route("/updateListData")
    .post(controller.updateListData);

router.route("/deleteListData")
    .post(controller.deleteListData);

router.route("/setStatus")
    .post(controller.setStatus);

router.route("/getStatusCount")
    .post(controller.getStatusCount);



export default router;