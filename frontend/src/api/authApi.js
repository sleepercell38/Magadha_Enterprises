import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}/admin`;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Login
export const loginAdminApi = async (email, password) => {
  try {
    const { data } = await api.post("/login", { email, password });
    if (!data.success) throw new Error(data.message);
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

// Register
export const registerAdminApi = async (name, email, password) => {
  try {
    const { data } = await api.post("/register", { name, email, password });
    if (!data.success) throw new Error(data.message);
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

// Fetch Profile
export const fetchProfileApi = async (token) => {
  try {
    const { data } = await api.get("/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!data.success) throw new Error(data.message);
    return data.admin;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

// Logout
export const logoutAdminApi = async (token) => {
  try {
    const { data } = await api.post("/logout", null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};
