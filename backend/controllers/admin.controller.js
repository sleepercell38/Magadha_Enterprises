import {
  registerAdminService,
  loginAdminService,
  logoutAdminService,
} from "../services/admin.service.js";

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const admin = await registerAdminService(name, email, password);
    res.status(201).json({ success: true, admin });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, admin } = await loginAdminService(email, password);
    res.status(200).json({ success: true, token, admin });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logoutAdmin = async (req, res) => {
  try {
    const response = await logoutAdminService();
    res.status(200).json({ success: true, ...response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getDashboard = async (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard" });
};
