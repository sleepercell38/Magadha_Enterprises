import express from "express";
import {
  createProject,
  getProjectsByAdmin,
  getProjectById,
  deleteProject,
} from "../controllers/project.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js"; 

const router = express.Router();

router.post("/", verifyAdmin, createProject);
router.get("/", verifyAdmin, getProjectsByAdmin);
router.get("/:projectId", verifyAdmin, getProjectById);
router.delete("/:projectId", verifyAdmin, deleteProject);

export default router;
