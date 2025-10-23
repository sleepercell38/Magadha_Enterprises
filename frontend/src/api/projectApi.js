
import axios from "axios";

const API_URL = "http://localhost:4000/api/projects";

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
