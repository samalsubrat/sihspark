import express from "express";
import { isLoggedIn } from "../middlewares/auth.js";
import {
  createUser,
  updateUser,
  deleteUser,
  listReports,
  listWaterTests,
  listUsers,
  getUserById,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", isLoggedIn, listUsers);
router.post("/users", isLoggedIn, createUser);
router.get("/users/:id", isLoggedIn, getUserById);
router.patch("/users/:id", isLoggedIn, updateUser);
router.delete("/users/:id", isLoggedIn, deleteUser);
router.get("/reports", isLoggedIn, listReports);
router.get("/water-tests", isLoggedIn, listWaterTests);

export default router;
