import {
  createProjectService,
  getProjectsByAdminService,
  getProjectByIdService,
  deleteProjectService,
} from "../services/project.service.js";

export const createProject = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const project = await createProjectService(adminId, req.body);
    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Get all projects of logged-in admin

export const getProjectsByAdmin = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const projects = await getProjectsByAdminService(adminId);
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//Get single project details

export const getProjectById = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { projectId } = req.params;
    const project = await getProjectByIdService(adminId, projectId);
    res.status(200).json(project);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


// Delete a project
export const deleteProject = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { projectId } = req.params;
    await deleteProjectService(adminId, projectId);
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
