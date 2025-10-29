import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/projects`;

export const createProjectApi = async (token, projectData) => {
  const res = await axios.post(API_URL, projectData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getProjectsApi = async (token) => {
  const res = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getProjectByIdApi = async (token, projectId) => {
  const res = await axios.get(`${API_URL}/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const deleteProjectApi = async (token, projectId) => {
  const res = await axios.delete(`${API_URL}/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const updateProjectApi = async (token, projectId, updateData) => {
  const response = await axios.put(`${API_URL}/${projectId}`, updateData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

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

export const getBillingEntriesApi = async (token, projectId) => {
  const res = await axios.get(`${API_URL}/${projectId}/billing`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

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

export const getBillingSummaryApi = async (token, projectId) => {
  const res = await axios.get(`${API_URL}/${projectId}/billing/summary`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

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