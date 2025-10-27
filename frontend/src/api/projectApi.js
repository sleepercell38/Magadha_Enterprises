import axios from "axios";

const API_URL = "http://localhost:4000/api/projects";

// ============= EXISTING PROJECT APIs =============
// Create a project
export const createProjectApi = async (token, projectData) => {
  const res = await axios.post(API_URL, projectData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Get all projects for the logged-in admin
export const getProjectsApi = async (token) => {
  const res = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Get single project details
export const getProjectByIdApi = async (token, projectId) => {
  const res = await axios.get(`${API_URL}/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Delete a project
export const deleteProjectApi = async (token, projectId) => {
  const res = await axios.delete(`${API_URL}/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Update a project
export const updateProjectApi = async (token, projectId, updateData) => {
  const response = await axios.put(`${API_URL}/${projectId}`, updateData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


// Add billing entry
export const addBillingEntryApi = async (token, projectId, billingData) => {
  const res = await axios.post(
    `${API_URL}/${projectId}/billing`,
    billingData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// Get billing entries
export const getBillingEntriesApi = async (token, projectId) => {
  const res = await axios.get(`${API_URL}/${projectId}/billing`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Update billing entry
export const updateBillingEntryApi = async (
  token,
  projectId,
  billingId,
  updateData
) => {
  const res = await axios.put(
    `${API_URL}/${projectId}/billing/${billingId}`,
    updateData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// Delete billing entry
export const deleteBillingEntryApi = async (token, projectId, billingId) => {
  const res = await axios.delete(
    `${API_URL}/${projectId}/billing/${billingId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// Get billing summary
export const getBillingSummaryApi = async (token, projectId) => {
  const res = await axios.get(`${API_URL}/${projectId}/billing/summary`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};


// Set/Update budget
export const setBudgetApi = async (token, projectId, budgetData) => {
  const res = await axios.post(`${API_URL}/${projectId}/budget`, budgetData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getBudgetApi = async (token, projectId) => {
  const res = await axios.get(`${API_URL}/${projectId}/budget`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};