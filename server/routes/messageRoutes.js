import express from "express";
import { sendMessageController } from "../controllers/messageController.js";
import { isLoggedIn } from "../middlewares/auth.js";

const router = express.Router();

// POST /api/messages
router.post("/",isLoggedIn, sendMessageController);

export default router;
