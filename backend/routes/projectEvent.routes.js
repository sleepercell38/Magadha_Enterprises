import express from "express";
import {
  getEventMetadata,
  createProjectEvent,
  getProjectEvents,
  updateEventStatus,
  deleteProjectEvent,
} from "../controllers/projectEvent.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Event routes
// router.get("/event-metadata", verifyAdmin, getEventMetadata);//can exclude this because we have pre defined this static route in our project routes

router.post("/:projectId/events", verifyAdmin, createProjectEvent);
router.get("/:projectId/events", verifyAdmin, getProjectEvents);
router.patch("/events/:eventId/status", verifyAdmin, updateEventStatus);
router.delete("/events/:eventId", verifyAdmin, deleteProjectEvent);

export default router;