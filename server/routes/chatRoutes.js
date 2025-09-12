import express from "express";
import { isLoggedIn } from "../middlewares/auth.js";
import { chat } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", isLoggedIn, chat);

export default router;
