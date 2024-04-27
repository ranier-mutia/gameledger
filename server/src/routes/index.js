import express from "express";
import user from "./userRoute.js";

const router = express.Router();

router.use("/user", user);

export default router;