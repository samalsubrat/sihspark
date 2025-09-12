import express from "express";
import { isLoggedIn } from "../middlewares/auth.js";
import { getProfile } from "../controllers/profileController.js";

const router = express.Router();

router.get("/", isLoggedIn, getProfile);

export default router;
