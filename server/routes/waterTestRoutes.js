import express from "express";
import { isLoggedIn } from "../middlewares/auth.js";
import {
  createWaterTest,
  updateWaterTest,
  deleteWaterTest,
  listAllWaterTests,
  getUserWaterTests,
} from "../controllers/waterTestController.js";

const router = express.Router();

router.post("/", isLoggedIn, createWaterTest);
router.patch("/:id", isLoggedIn, updateWaterTest);
router.delete("/:id", isLoggedIn, deleteWaterTest);
router.get("/all", isLoggedIn, listAllWaterTests);
router.get("/", isLoggedIn, getUserWaterTests);

export default router;
