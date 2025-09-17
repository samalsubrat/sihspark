import express from "express";
import { isLoggedIn } from "../middlewares/auth.js";
import {
  createOrUpdateHealthCard,
  getHealthCard,
  getAllHealthCards,
  refreshHealthCard
} from "../controllers/healthCardController.js";

const router = express.Router();

// Create or update health card
router.post("/", isLoggedIn, createOrUpdateHealthCard);

// Get health card by waterbody ID (public access for QR code scanning)
router.get("/:waterbodyId", getHealthCard);

// Get all health cards (requires authentication)
router.get("/", isLoggedIn, getAllHealthCards);

// Refresh/update health card data
router.patch("/:waterbodyId/refresh", isLoggedIn, refreshHealthCard);

export default router;
