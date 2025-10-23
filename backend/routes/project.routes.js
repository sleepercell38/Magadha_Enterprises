import express from "express";
import {
  createProject,
  getProjectsByAdmin,
  getProjectById,
  deleteProject,
} from "../controllers/project.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// IMPORTANT: Static routes MUST come BEFORE dynamic routes
router.get("/event-metadata", verifyAdmin, (req, res) => {
  const metadata = {
    siteVisiting: {
      label: "Site Visiting",
      fields: [
        { name: "visitDate", label: "Visit Date", type: "date", required: true },
        { name: "location", label: "Site Location", type: "text", required: true },
        { name: "visitPurpose", label: "Purpose of Visit", type: "text", required: true },
        { name: "attendees", label: "Attendees", type: "text", placeholder: "Names separated by comma" },
        { name: "notes", label: "Notes", type: "textarea", rows: 4 }
      ]
    },
    mapping: {
      label: "Mapping",
      fields: [
        { name: "mappingDate", label: "Mapping Date", type: "date", required: true },
        { name: "mapArea", label: "Mapped Area (sq.m)", type: "number", required: true },
        { name: "mapType", label: "Map Type", type: "select", required: true, 
          options: ["Topographic", "Site Plan", "Survey", "Other"] },
        { name: "notes", label: "Notes", type: "textarea", rows: 4 }
      ]
    },
    sketching: {
      label: "Sketching",
      fields: [
        { name: "sketchDate", label: "Sketch Date", type: "date", required: true },
        { name: "sketchType", label: "Sketch Type", type: "select", required: true,
          options: ["Floor Plan", "Elevation", "3D View", "Detail", "Other"] },
        { name: "description", label: "Description", type: "textarea", rows: 4, required: true }
      ]
    },
    siteInspection: {
      label: "Site Inspection",
      fields: [
        { name: "inspectionDate", label: "Inspection Date", type: "date", required: true },
        { name: "inspector", label: "Inspector Name", type: "text", required: true },
        { name: "workProgress", label: "Work Progress (%)", type: "number", min: 0, max: 100, required: true },
        { name: "qualityRating", label: "Quality Rating", type: "select", required: true,
          options: ["Excellent", "Good", "Average", "Poor"] },
        { name: "issues", label: "Issues Found", type: "textarea", rows: 4 },
        { name: "recommendations", label: "Recommendations", type: "textarea", rows: 4 }
      ]
    },
    materialDelivery: {
      label: "Material Delivery",
      fields: [
        { name: "deliveryDate", label: "Delivery Date", type: "date", required: true },
        { name: "materialType", label: "Material Type", type: "text", required: true },
        { name: "quantity", label: "Quantity", type: "number", required: true },
        { name: "unit", label: "Unit", type: "select", required: true,
          options: ["kg", "tons", "pieces", "bags", "cubic meters"] },
        { name: "supplier", label: "Supplier Name", type: "text", required: true },
        { name: "invoiceNumber", label: "Invoice Number", type: "text" },
        { name: "notes", label: "Notes", type: "textarea", rows: 3 }
      ]
    },
    meetingScheduled: {
      label: "Meeting Scheduled",
      fields: [
        { name: "meetingDate", label: "Meeting Date", type: "datetime-local", required: true },
        { name: "meetingType", label: "Meeting Type", type: "select", required: true,
          options: ["Client Meeting", "Team Meeting", "Vendor Meeting", "Site Meeting"] },
        { name: "agenda", label: "Agenda", type: "textarea", rows: 4, required: true },
        { name: "participants", label: "Participants", type: "text", placeholder: "Names separated by comma" },
        { name: "location", label: "Location", type: "text", required: true }
      ]
    }
  };
  
  res.json(metadata);
});
router.post("/", verifyAdmin, createProject);
router.get("/", verifyAdmin, getProjectsByAdmin);
router.get("/:projectId", verifyAdmin, getProjectById);
router.delete("/:projectId", verifyAdmin, deleteProject);

export default router;