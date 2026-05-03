import express from "express";
import user from "./userRoute.js";
import game from "./gameRoute.js";
import event from "./eventRoute.js";
import list from "./listRoute.js";
import preference from "./preferenceRoute.js";
import review from "./reviewRoute.js";
import activity from "./activityRoute.js";
import follow from "./followRoute.js"

const router = express.Router();

router.use("/users", user);
router.use("/games", game);
router.use("/events", event);
router.use("/lists", list);
router.use("/preferences", preference);
router.use("/reviews", review);
router.use("/activities", activity);
router.use("/follows", follow);

export default router;