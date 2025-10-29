import {
  createProjectService,
  getProjectsByAdminService,
  getProjectByIdService,
  deleteProjectService,
  updateProjectService, 
  addBillingEntryService,
  getBillingEntriesService,
  updateBillingEntryService,
  deleteBillingEntryService,
  getBillingSummaryService,
  setBudgetService,
  getBudgetService,
  addBudgetItemService,
  updateBudgetItemService,
  deleteBudgetItemService,
} from "../services/project.service.js";

// Create a new project
export const createProject = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const project = await createProjectService(adminId, req.body);
    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all projects of logged-in admin
export const getProjectsByAdmin = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const projects = await getProjectsByAdminService(adminId);
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single project details
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

// Update a project (name, client info, or status)
export const updateProject = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { projectId } = req.params;
    const updateData = req.body;

    const updatedProject = await updateProjectService(adminId, projectId, updateData);

    res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add billing entry
export const addBillingEntry = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { projectId } = req.params;
    const billingData = req.body;

    const project = await addBillingEntryService(adminId, projectId, billingData);
    
    res.status(201).json({
      message: "Billing entry added successfully",
      billing: project.billing[project.billing.length - 1],
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all billing entries for a project
export const getBillingEntries = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { projectId } = req.params;

    const project = await getBillingEntriesService(adminId, projectId);
    
    res.status(200).json({
      projectName: project.projectName,
      clientName: project.clientName,
      billing: project.billing,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Update a billing entry
export const updateBillingEntry = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { projectId, billingId } = req.params;
    const updateData = req.body;

    const project = await updateBillingEntryService(
      adminId,
      projectId,
      billingId,
      updateData
    );

    res.status(200).json({
      message: "Billing entry updated successfully",
      billing: project.billing.find(b => b._id.toString() === billingId),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a billing entry
export const deleteBillingEntry = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { projectId, billingId } = req.params;

    await deleteBillingEntryService(adminId, projectId, billingId);

    res.status(200).json({
      message: "Billing entry deleted successfully",
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get billing summary with status breakdown
export const getBillingSummary = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { projectId } = req.params;

    const summary = await getBillingSummaryService(adminId, projectId);
    
    res.status(200).json(summary);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Set/Update budget
export const setBudget = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { projectId } = req.params;
    const budgetData = req.body;

    const project = await setBudgetService(adminId, projectId, budgetData);
    
    res.status(200).json({
      message: "Budget updated successfully",
      budget: project.budget,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add budget item
export const addBudgetItem = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { projectId } = req.params;
    const itemData = req.body;

    const project = await addBudgetItemService(adminId, projectId, itemData);
    
    res.status(201).json({
      message: "Budget item added successfully",
      budget: project.budget,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update budget item
export const updateBudgetItem = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { projectId, itemId } = req.params;
    const updateData = req.body;

    const project = await updateBudgetItemService(
      adminId,
      projectId,
      itemId,
      updateData
    );

    res.status(200).json({
      message: "Budget item updated successfully",
      budget: project.budget,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete budget item
export const deleteBudgetItem = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { projectId, itemId } = req.params;

    const project = await deleteBudgetItemService(adminId, projectId, itemId);

    res.status(200).json({
      message: "Budget item deleted successfully",
      budget: project.budget,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get budget
export const getBudget = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { projectId } = req.params;

    const project = await getBudgetService(adminId, projectId);
    
    res.status(200).json({
      projectName: project.projectName,
      clientName: project.clientName,
      budget: project.budget,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};