import express from "express";
import { isLoggedIn } from "../middlewares/auth.js";
import {
  listLeaderAlerts,
  listGlobalAlerts,
  getAllAlerts,
  getAlertStats,
} from "../controllers/alertController.js";

const router = express.Router();

// Get all alerts (both leader and global)
router.get("/", isLoggedIn, getAllAlerts);

// Get only leader alerts
router.get("/leader", isLoggedIn, listLeaderAlerts);

// Get only global alerts
router.get("/global", isLoggedIn, listGlobalAlerts);

// Get alert statistics
router.get("/stats", isLoggedIn, getAlertStats);

export default router;
