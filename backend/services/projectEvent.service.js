import ProjectEvent from "../models/projectEvent.model.js";
import Project from "../models/project.model.js";
import { eventMetadata } from "../config/eventMetadata.js";

export const getEventMetadataService = () => {
    return eventMetadata;
};

export const createProjectEventService = async (adminId, projectId, eventData) => {
    const project = await Project.findOne({ _id: projectId, admin: adminId });
    if (!project) {
        throw new Error("Project not found or access denied");
    }

    if (!eventMetadata[eventData.type]) {
        throw new Error("Invalid event type");
    }

    const requiredFields = eventMetadata[eventData.type].fields
        .filter(field => field.required)
        .map(field => field.name);

    for (const field of requiredFields) {
        if (!eventData.data[field]) {
            throw new Error(`Missing required field: ${field}`);
        }
    }

    const newEvent = await ProjectEvent.create({
        project: projectId,
        admin: adminId,
        type: eventData.type,
        data: eventData.data,
        status: eventData.status || "pending",
        eventDate: eventData.eventDate || Date.now(),
    });

    return newEvent;
};

export const getProjectEventsService = async (adminId, projectId) => {
    const project = await Project.findOne({ _id: projectId, admin: adminId });
    if (!project) {
        throw new Error("Project not found or access denied");
    }

    const events = await ProjectEvent.find({ project: projectId })
        .sort({ eventDate: -1 })
        .populate("admin", "name email");

    const eventsWithLabels = events.map(event => ({
        ...event.toObject(),
        typeLabel: eventMetadata[event.type]?.label || event.type
    }));

    return eventsWithLabels;
};

export const updateEventStatusService = async (adminId, eventId, status) => {
    const event = await ProjectEvent.findOneAndUpdate(
        { _id: eventId, admin: adminId },
        { status },
        { new: true }
    );

    if (!event) {
        throw new Error("Event not found or access denied");
    }

    return event;
};

export const deleteProjectEventService = async (adminId, eventId) => {
    const deleted = await ProjectEvent.findOneAndDelete({
        _id: eventId,
        admin: adminId
    });

    if (!deleted) {
        throw new Error("Event not found or access denied");
    }

    return deleted;
};