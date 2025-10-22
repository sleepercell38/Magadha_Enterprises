import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.modal.js";

export const registerAdminService = async (name, email, password) => {
  const existing = await Admin.findOne({ email });
  if (existing) throw new Error("Email already registered");

  const hashed = await bcrypt.hash(password, 10);
  const newAdmin = await Admin.create({ name, email, password: hashed });

  return {
    id: newAdmin._id,
    name: newAdmin.name,
    email: newAdmin.email,
  };
};

export const loginAdminService = async (email, password) => {
  const admin = await Admin.findOne({ email });
  if (!admin) throw new Error("Admin not found");

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return {
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
    },
  };
};

export const logoutAdminService = async () => {
  return { message: "Logout successful" };
};
