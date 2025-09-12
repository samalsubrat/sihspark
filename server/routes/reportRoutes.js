import express from "express";
import {
  createReport,
  listLeaderReports,
  updateReport,
  deleteReport,
} from "../controllers/reportController.js";
import { isLoggedIn } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", createReport);
router.get("/", isLoggedIn, listLeaderReports);
router.delete("/:id", isLoggedIn, deleteReport);
router.patch("/:id", isLoggedIn, updateReport);

export default router;
