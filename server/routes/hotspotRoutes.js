import express from "express";
import { isLoggedIn } from "../middlewares/auth.js";
import {
  createHotspot,
  listHotspots,
  getHotspotById,
  updateHotspot,
  deleteHotspot,
} from "../controllers/hotspotController.js";

const router = express.Router();

router.get("/", listHotspots);
router.get("/:id", getHotspotById);
router.post("/", isLoggedIn, createHotspot);
router.patch("/:id", isLoggedIn, updateHotspot);
router.delete("/:id", isLoggedIn, deleteHotspot);

export default router;
