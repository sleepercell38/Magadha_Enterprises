
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createProjectApi,
  getProjectsApi,
  getProjectByIdApi,
  deleteProjectApi,
} from "../../api/projectApi";

// CREATE PROJECT
export const createProject = createAsyncThunk(
  "project/createProject",
  async ({ token, projectData }, { rejectWithValue }) => {
    try {
      const data = await createProjectApi(token, projectData);
      return data.project;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create project");
    }
  }
);

// FETCH ALL PROJECTS
export const fetchProjects = createAsyncThunk(
  "project/fetchProjects",
  async (token, { rejectWithValue }) => {
    try {
      const data = await getProjectsApi(token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch projects");
    }
  }
);

// FETCH SINGLE PROJECT
export const fetchProjectById = createAsyncThunk(
  "project/fetchProjectById",
  async ({ token, projectId }, { rejectWithValue }) => {
    try {
      const data = await getProjectByIdApi(token, projectId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch project");
    }
  }
);

// DELETE PROJECT
export const deleteProject = createAsyncThunk(
  "project/deleteProject",
  async ({ token, projectId }, { rejectWithValue }) => {
    try {
      await deleteProjectApi(token, projectId);
      return projectId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete project");
    }
  }
);

// SLICE
const projectSlice = createSlice({
  name: "project",
  initialState: {
    projects: [],
    selectedProject: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearProjectState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE PROJECT
      .addCase(createProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.unshift(action.payload);
        state.success = "Project created successfully";
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH PROJECTS
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH SINGLE PROJECT
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE PROJECT
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(
          (p) => p._id !== action.payload
        );
        state.success = "Project deleted successfully";
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProjectState } = projectSlice.actions;
export default projectSlice.reducer;
