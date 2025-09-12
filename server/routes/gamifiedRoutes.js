import express from "express";
import { isLoggedIn } from "../middlewares/auth.js";
import {
  createPlaybook,
  listPlaybooks,
  updatePlaybook,
  deletePlaybook,
  createStory,
  listStories,
  updateStory,
  deleteStory,
  createTestimonial,
  listTestimonials,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/gamifiedController.js";

const router = express.Router();

// Public lists
router.get("/playbooks", listPlaybooks);
router.get("/stories", listStories);
router.get("/testimonials", listTestimonials);

// endpoints (logged-in; admin/leader)
router.post("/playbooks", isLoggedIn, createPlaybook);
router.put("/playbooks/:id", isLoggedIn, updatePlaybook);
router.delete("/playbooks/:id", isLoggedIn, deletePlaybook);
router.post("/stories", isLoggedIn, createStory);
router.put("/stories/:id", isLoggedIn, updateStory);
router.delete("/stories/:id", isLoggedIn, deleteStory);
router.post("/testimonials", isLoggedIn, createTestimonial);
router.put("/testimonials/:id", isLoggedIn, updateTestimonial);
router.delete("/testimonials/:id", isLoggedIn, deleteTestimonial);

export default router;
