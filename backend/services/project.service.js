import Project from "../models/project.model.js";

export const createProjectService = async (adminId, projectData) => {
  const { clientName, projectName, clientEmail, clientPhone, startDate } = projectData;

  const newProject = await Project.create({
    admin: adminId,
    clientName,
    projectName,
    clientEmail,
    clientPhone,
    startDate,
  });

  return newProject;
};

// Get all projects created by a specific admin

export const getProjectsByAdminService = async (adminId) => {
  const projects = await Project.find({ admin: adminId }).sort({ createdAt: -1 });
  return projects;
};

//Get a single project by ID (ensure it belongs to the admin)

export const getProjectByIdService = async (adminId, projectId) => {
  const project = await Project.findOne({ _id: projectId, admin: adminId });
  if (!project) throw new Error("Project not found or access denied");
  return project;
};

// Delete a project

export const deleteProjectService = async (adminId, projectId) => {
  const deleted = await Project.findOneAndDelete({ _id: projectId, admin: adminId });
  if (!deleted) throw new Error("Project not found or access denied");
  return deleted;
};
