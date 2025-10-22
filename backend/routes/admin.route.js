import express from "express";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
} from "../controllers/admin.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.get("/profile", verifyAdmin, (req, res) => {
  res.status(200).json({ success: true, admin: req.admin });
});

export default router;
