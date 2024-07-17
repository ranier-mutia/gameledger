import express from "express";
import user from "./userRoute.js";
import game from "./gameRoute.js";
import event from "./eventRoute.js";

const router = express.Router();

router.use("/users", user);
router.use("/games", game);
router.use("/events", event);

export default router;