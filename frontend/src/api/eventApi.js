import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/projects`;

export const getEventMetadataApi = async (token) => {
  const res = await axios.get(`${API_URL}/event-metadata`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const createProjectEventApi = async (token, projectId, eventData) => {
  const res = await axios.post(
    `${API_URL}/${projectId}/events`,
    eventData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getProjectEventsApi = async (token, projectId) => {
  const res = await axios.get(`${API_URL}/${projectId}/events`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const updateEventStatusApi = async (token, eventId, status) => {
  const res = await axios.patch(
    `${API_URL}/events/${eventId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const deleteEventApi = async (token, eventId) => {
  const res = await axios.delete(`${API_URL}/events/${eventId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};