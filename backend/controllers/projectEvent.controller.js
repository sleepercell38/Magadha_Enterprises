import {
  getEventMetadataService,
  createProjectEventService,
  getProjectEventsService,
  updateEventStatusService,
  deleteProjectEventService,
} from "../services/projectEvent.service.js";

export const getEventMetadata = async (req, res) => {
  try {
    const metadata = getEventMetadataService();
    res.status(200).json(metadata);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProjectEvent = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { projectId } = req.params;
    const event = await createProjectEventService(adminId, projectId, req.body);
    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getProjectEvents = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { projectId } = req.params;
    const events = await getProjectEventsService(adminId, projectId);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEventStatus = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { eventId } = req.params;
    const { status } = req.body;
    const event = await updateEventStatusService(adminId, eventId, status);
    res.status(200).json({ message: "Event status updated", event });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProjectEvent = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { eventId } = req.params;
    await deleteProjectEventService(adminId, eventId);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};