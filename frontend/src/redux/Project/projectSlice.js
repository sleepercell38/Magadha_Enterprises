import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createProjectApi,
  getProjectsApi,
  getProjectByIdApi,
  deleteProjectApi,
  updateProjectApi,
  addBillingEntryApi,
  getBillingEntriesApi,
  updateBillingEntryApi,
  deleteBillingEntryApi,
  getBillingSummaryApi,
  setBudgetApi,
  getBudgetApi,
} from "../../api/projectApi";

// ============= PROJECT THUNKS =============

// CREATE PROJECT
export const createProject = createAsyncThunk(
  "project/createProject",
  async ({ token, projectData }, { rejectWithValue }) => {
    try {
      const data = await createProjectApi(token, projectData);
      return data.project;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create project"
      );
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
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch projects"
      );
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
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch project"
      );
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
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete project"
      );
    }
  }
);

// UPDATE PROJECT
export const updateProject = createAsyncThunk(
  "project/updateProject",
  async ({ token, projectId, updateData }, { rejectWithValue }) => {
    try {
      const data = await updateProjectApi(token, projectId, updateData);
      return data.project;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update project"
      );
    }
  }
);

// ============= BILLING THUNKS =============

// ADD BILLING ENTRY
export const addBillingEntry = createAsyncThunk(
  "project/addBillingEntry",
  async ({ token, projectId, billingData }, { rejectWithValue }) => {
    try {
      const data = await addBillingEntryApi(token, projectId, billingData);
      return { projectId, billing: data.billing };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add billing entry"
      );
    }
  }
);

// GET BILLING ENTRIES
export const fetchBillingEntries = createAsyncThunk(
  "project/fetchBillingEntries",
  async ({ token, projectId }, { rejectWithValue }) => {
    try {
      const data = await getBillingEntriesApi(token, projectId);
      return { projectId, ...data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch billing entries"
      );
    }
  }
);

// UPDATE BILLING ENTRY
export const updateBillingEntry = createAsyncThunk(
  "project/updateBillingEntry",
  async ({ token, projectId, billingId, updateData }, { rejectWithValue }) => {
    try {
      const data = await updateBillingEntryApi(
        token,
        projectId,
        billingId,
        updateData
      );
      return { projectId, billing: data.billing };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update billing entry"
      );
    }
  }
);

// DELETE BILLING ENTRY
export const deleteBillingEntry = createAsyncThunk(
  "project/deleteBillingEntry",
  async ({ token, projectId, billingId }, { rejectWithValue }) => {
    try {
      await deleteBillingEntryApi(token, projectId, billingId);
      return { projectId, billingId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete billing entry"
      );
    }
  }
);

// GET BILLING SUMMARY
export const fetchBillingSummary = createAsyncThunk(
  "project/fetchBillingSummary",
  async ({ token, projectId }, { rejectWithValue }) => {
    try {
      const data = await getBillingSummaryApi(token, projectId);
      return { projectId, summary: data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch billing summary"
      );
    }
  }
);

// ============= BUDGET THUNKS =============

// SET/UPDATE BUDGET
export const setBudget = createAsyncThunk(
  "project/setBudget",
  async ({ token, projectId, budgetData }, { rejectWithValue }) => {
    try {
      const data = await setBudgetApi(token, projectId, budgetData);
      return { projectId, budget: data.budget };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to set budget"
      );
    }
  }
);

// GET BUDGET
export const fetchBudget = createAsyncThunk(
  "project/fetchBudget",
  async ({ token, projectId }, { rejectWithValue }) => {
    try {
      const data = await getBudgetApi(token, projectId);
      return { projectId, ...data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch budget"
      );
    }
  }
);

// SLICE
const projectSlice = createSlice({
  name: "project",
  initialState: {
    projects: [],
    selectedProject: null,
    billing: {
      entries: [],
      summary: null,
      loading: false,
    },
    budget: {
      data: null,
      loading: false,
    },
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
    clearBillingState: (state) => {
      state.billing.entries = [];
      state.billing.summary = null;
      state.billing.loading = false;
    },
    clearBudgetState: (state) => {
      state.budget.data = null;
      state.budget.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
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

      // UPDATE PROJECT
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProject = action.payload;

        state.projects = state.projects.map((project) =>
          project._id === updatedProject._id ? updatedProject : project
        );

        if (
          state.selectedProject &&
          state.selectedProject._id === updatedProject._id
        ) {
          state.selectedProject = updatedProject;
        }

        state.success = "Project updated successfully";
      })
      .addCase(updateProject.rejected, (state, action) => {
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
      })

      // ============= BILLING CASES =============
      // ADD BILLING ENTRY
      .addCase(addBillingEntry.pending, (state) => {
        state.billing.loading = true;
        state.error = null;
      })
      .addCase(addBillingEntry.fulfilled, (state, action) => {
        state.billing.loading = false;
        state.billing.entries.push(action.payload.billing);
        
        // Update project's billing in the projects list
        const projectIndex = state.projects.findIndex(
          (p) => p._id === action.payload.projectId
        );
        if (projectIndex !== -1 && state.projects[projectIndex].billing) {
          state.projects[projectIndex].billing.push(action.payload.billing);
        }
        
        state.success = "Billing entry added successfully";
      })
      .addCase(addBillingEntry.rejected, (state, action) => {
        state.billing.loading = false;
        state.error = action.payload;
      })

      // FETCH BILLING ENTRIES
      .addCase(fetchBillingEntries.pending, (state) => {
        state.billing.loading = true;
      })
      .addCase(fetchBillingEntries.fulfilled, (state, action) => {
        state.billing.loading = false;
        state.billing.entries = action.payload.billing || [];
      })
      .addCase(fetchBillingEntries.rejected, (state, action) => {
        state.billing.loading = false;
        state.error = action.payload;
      })

      // UPDATE BILLING ENTRY
      .addCase(updateBillingEntry.pending, (state) => {
        state.billing.loading = true;
      })
      .addCase(updateBillingEntry.fulfilled, (state, action) => {
        state.billing.loading = false;
        
        // Update in billing entries
        const billingIndex = state.billing.entries.findIndex(
          (b) => b._id === action.payload.billing._id
        );
        if (billingIndex !== -1) {
          state.billing.entries[billingIndex] = action.payload.billing;
        }
        
        state.success = "Billing entry updated successfully";
      })
      .addCase(updateBillingEntry.rejected, (state, action) => {
        state.billing.loading = false;
        state.error = action.payload;
      })

      // DELETE BILLING ENTRY
      .addCase(deleteBillingEntry.pending, (state) => {
        state.billing.loading = true;
      })
      .addCase(deleteBillingEntry.fulfilled, (state, action) => {
        state.billing.loading = false;
        state.billing.entries = state.billing.entries.filter(
          (b) => b._id !== action.payload.billingId
        );
        state.success = "Billing entry deleted successfully";
      })
      .addCase(deleteBillingEntry.rejected, (state, action) => {
        state.billing.loading = false;
        state.error = action.payload;
      })

      // FETCH BILLING SUMMARY
      .addCase(fetchBillingSummary.pending, (state) => {
        state.billing.loading = true;
      })
      .addCase(fetchBillingSummary.fulfilled, (state, action) => {
        state.billing.loading = false;
        state.billing.summary = action.payload.summary;
      })
      .addCase(fetchBillingSummary.rejected, (state, action) => {
        state.billing.loading = false;
        state.error = action.payload;
      })

      // ============= BUDGET CASES =============
      // SET BUDGET
      .addCase(setBudget.pending, (state) => {
        state.budget.loading = true;
        state.error = null;
      })
      .addCase(setBudget.fulfilled, (state, action) => {
        state.budget.loading = false;
        state.budget.data = action.payload.budget;
        
        // Update project's budget in the projects list
        const projectIndex = state.projects.findIndex(
          (p) => p._id === action.payload.projectId
        );
        if (projectIndex !== -1) {
          state.projects[projectIndex].budget = action.payload.budget;
        }
        
        // Update selected project if it's the same
        if (
          state.selectedProject &&
          state.selectedProject._id === action.payload.projectId
        ) {
          state.selectedProject.budget = action.payload.budget;
        }
        
        state.success = "Budget updated successfully";
      })
      .addCase(setBudget.rejected, (state, action) => {
        state.budget.loading = false;
        state.error = action.payload;
      })

      // FETCH BUDGET
      .addCase(fetchBudget.pending, (state) => {
        state.budget.loading = true;
      })
      .addCase(fetchBudget.fulfilled, (state, action) => {
        state.budget.loading = false;
        state.budget.data = action.payload.budget;
      })
      .addCase(fetchBudget.rejected, (state, action) => {
        state.budget.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProjectState, clearBillingState, clearBudgetState } =
  projectSlice.actions;
export default projectSlice.reducer;