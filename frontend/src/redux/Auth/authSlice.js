import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginAdminApi,
  registerAdminApi,
  fetchProfileApi,
  logoutAdminApi,
} from "../../api/authApi";

const token = localStorage.getItem("adminToken");

const initialState = {
  admin: null,
  token: token || null,
  loading: false,
  error: null,
};

// Async Thunks
export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await loginAdminApi(email, password);
      localStorage.setItem("adminToken", data.token);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const registerAdmin = createAsyncThunk(
  "auth/registerAdmin",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const data = await registerAdminApi(name, email, password);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      if (!token) throw new Error("No token found");
      const admin = await fetchProfileApi(token);
      return admin;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const logoutAdmin = createAsyncThunk(
  "auth/logoutAdmin",
  async (_, { getState }) => {
    const { auth } = getState();
    const token = auth.token;
    await logoutAdminApi(token);
    localStorage.removeItem("adminToken");
    return true;
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
        state.token = action.payload.token;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register
      .addCase(registerAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAdmin.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.token = null;
        localStorage.removeItem("adminToken");
      })

      // Logout
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.admin = null;
        state.token = null;
      });
  },
});

export default authSlice.reducer;
